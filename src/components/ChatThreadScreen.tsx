import Animated, { SlideOutUp } from 'react-native-reanimated';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import { FirestoreMessageType, SearchCriteria, SearchScope } from 'types/chat';
import { FlatList, Keyboard, ListRenderItem, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  addGroup,
  chatMessagesCollectionChangeListener,
  getChatMessages,
  getUsers,
  groupsDocumentChangeListener,
  sendTypingState,
  updateChatMessage,
  updateGroup,
  updateUser,
} from 'firebase/firestore';
import {
  chatTheme,
  handleMessagePress,
  sendMessages,
  useSelectAttachments,
} from 'lib/chat';
import { getGroupAvatarColor, getGroupMembersLongStr } from 'lib/group';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ChatHeaderTitle } from 'components/molecules/ChatHeaderTitle';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Group } from 'types/group';
import { Incubator } from 'react-native-ui-lib';
import { ListItem } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { UserPickerModal } from 'components/modals/UserPickerModal';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';
import notifee from '@notifee/react-native';
import { resolveUrl } from 'lib/fileCache';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

const initialSearchCriteria = { text: '', scope: SearchScope.Username };
const minimumRequiredCharsForSearch = 2;

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const selectAttachments = useSelectAttachments();

  const tabBarHeight = useBottomTabBarHeight();
  const [group, setGroup] = useState(route.params.group);
  const myGroups = useRef(route.params.myGroups);
  const composingGroup = useRef(lodash.isEmpty(route.params.group));
  const myUserProfile = useSelector(selectUserProfile);
  const [isTyping, setIsTyping] = useState(false);
  const typingNames = useRef<string | undefined>();
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<MessageType.Any[]>([]);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(
    initialSearchCriteria,
  );
  const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [userSearchSet, setUserSearchSet] = useState<UserProfile[]>([]);
  const userPickerModalRef = useRef<UserPickerModal>(null);

  useEffect(() => {
    if (!myUserProfile) {
      navigation.dispatch(StackActions.popToTop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserProfile]);

  // Messages listener
  useEffect(() => {
    if (!group?.id) return;
    setIsLoading(true);

    const subscription = chatMessagesCollectionChangeListener(
      group?.id,
      async snapshot => {
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        if (snapshot.metadata.hasPendingWrites || snapshot.empty) return;
        await processChatMessageDocuments(snapshot.docs);
        setIsLoading(false);
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.id]);

  const getMoreChatMessages = async () => {
    if (group?.id && !allLoaded.current) {
      const s = await getChatMessages(group.id, {
        lastDocument: lastDocument.current,
      });
      allLoaded.current = s.allLoaded;
      lastDocument.current = s.lastDocument;
      await processChatMessageDocuments(s.snapshot.docs);
    }
  };

  const processChatMessageDocuments = async (
    messageDocs: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>[],
  ) => {
    const processedMessages: MessageType.Any[] = [];
    const messageUpdatePromises: Promise<void>[] = [];

    // Keep track of how many new messages I've read.
    let recentMessagesCount = 0;
    const now = new Date().toISOString();

    // Process all messages and mark new messages that have not been read by me.
    messageDocs.forEach(doc => {
      messageUpdatePromises.push(
        new Promise<void>((resolve, _reject) => {
          (async () => {
            // Critical to clone here so that date conversion does not mutate the lastDocument which
            // is used as the pagination cursor.
            const msg = Object.assign({}, doc.data()) as FirestoreMessageType;

            // Convert server timestamps to be compatible with chat library (javascript ms timestamp).
            msg.createdAt =
              (msg.createdAt as FirebaseFirestoreTypes.Timestamp).seconds *
              1000;

            if (msg.updatedAt) {
              msg.updatedAt =
                (msg.updatedAt as FirebaseFirestoreTypes.Timestamp).seconds *
                1000;
            }

            // Set delivery and readBy status for .
            if (myUserProfile?.id) {
              if (msg.author.id === myUserProfile.id) {
                // When our sent message comes back to us then it has been delivered.
                // This status is only set locally for UI update.
                msg.status = 'delivered';
              } else if (!msg.readBy?.[myUserProfile.id]) {
                // Mark this message as seen since we haven't see it before now.
                group?.id &&
                  (await updateChatMessage(
                    {
                      readBy: {
                        ...msg.readBy,
                        [myUserProfile.id]: {
                          name: `${myUserProfile.firstName} ${myUserProfile.lastName}`,
                          readAt: now,
                        },
                      },
                      status: 'seen',
                    },
                    msg.id,
                    group.id,
                  ));

                recentMessagesCount++;
              }
            }

            processedMessages.push(msg as MessageType.Any);
            resolve();
          })();
        }),
      );
    });

    // Wait for all newly read messages to be updated at the server.
    await Promise.all(messageUpdatePromises);

    if (processedMessages.length) {
      // Reduce app and user badge count by the number of new messages read.
      if (recentMessagesCount > 0) {
        // This supported on iOS only. Android has no maintainable support for app icon badging.
        // See https://github.com/invertase/notifee/issues/409#issuecomment-1136100729
        notifee.decrementBadgeCount(recentMessagesCount);

        const updatedProfile = Object.assign({}, myUserProfile);
        updatedProfile.notifications.badgeCount = Math.max(
          0,
          updatedProfile.notifications.badgeCount - recentMessagesCount,
        );
        await updateUser(updatedProfile);
      }

      // Sort and set our messages for UI presentation.
      processedMessages.sort((a, b) => {
        return (b.createdAt as number) - (a.createdAt as number);
      });

      setChatMessages(chatMessages.concat(processedMessages));

      // At the group level, indicate that I have read the most recent message.
      if (!composingGroup.current) {
        setLatestMessageAsReadByMe();
      }
    }
  };

  // Typing indicator
  useEffect(() => {
    if (!group?.id) return;

    const subscription = groupsDocumentChangeListener(group.id, snapshot => {
      if (snapshot.metadata.hasPendingWrites || !snapshot.exists) return;

      const doc = {
        ...snapshot.data(),
        id: snapshot.id,
      } as Group;

      const typingState = (doc.isTyping as { [key in string]: string }[]) || [];

      // Set typing state on our ui.
      const othersTyping = lodash.reject(typingState, el => {
        return el[myUserProfile?.id || ''] !== undefined;
      });

      setIsTyping(Object.keys(othersTyping).length > 0);
      typingNames.current = '';

      othersTyping.forEach(other => {
        typingNames.current = typingNames.current?.concat(
          `${typingNames.current?.length ? ', ' : ''}${
            other[Object.keys(other)[0]]
          }`,
        );
      });
      typingNames.current = typingNames.current.length
        ? typingNames.current
        : undefined;
    });

    return () => {
      subscription();

      if (myUserProfile?.id && group.id) {
        // Make sure we stop typing when the view is dismissed.
        setTypingState();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.id]);

  // Set the group header or composer header.
  useEffect(() => {
    if (composingGroup.current) {
      // Get the list of users for search.
      getUsers().then(users => {
        setUserSearchSet(users.result);
      });

      navigation.setOptions({
        title: 'New Message',
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <Button
            type={'clear'}
            icon={
              <Icon
                name={'plus-circle-outline'}
                type={'material-community'}
                color={theme.colors.brandSecondary}
                size={28}
              />
            }
            onPress={() => {
              Keyboard.dismiss();
              userPickerModalRef.current?.present();
            }}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: renderHeaderTitle,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composingGroup.current]);

  // Select and set/unset a group (shows messages) while adding users during composing a group.
  useEffect(() => {
    if (!composingGroup.current) return;

    const added = addedUsers.map(u => {
      return u.id;
    });

    if (added.length) {
      const group = myGroups.current?.find(g => {
        // This test requires my user id since stored members includes me.
        return lodash.isEqual(
          lodash.sortBy(added.concat(myUserProfile?.id)),
          lodash.sortBy(g.members),
        );
      });

      if (group) {
        setGroup(group);
      } else {
        setGroup(undefined);
        setChatMessages([]);
      }
    } else {
      setGroup(undefined);
      setChatMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedUsers]);

  // Filter users while typing.
  useEffect(() => {
    // On initial entry to search (user tapped search input)...
    // clear filtered data so only filtered results will display when search text is set.
    if (searchFocused && searchCriteria.text === '') {
      setFilteredUsers([]);
    }
  }, [searchFocused, searchCriteria]);

  const resetSearch = () => {
    setSearchFocused(false);
    searchFilter(initialSearchCriteria);
  };

  const createGroup = async (): Promise<Group> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const members = [myUserProfile!].concat(addedUsers);
    // Uniq allows for a group of one - chat with myself.
    const memberIds = lodash.uniq(
      members.map(u => {
        return u.id;
      }),
    ) as string[];

    const groupName = getGroupMembersLongStr(members);

    const newGroup = {
      createdBy: myUserProfile?.id,
      name: groupName,
      type: 'private',
      members: memberIds,
      leaders: [myUserProfile?.id],
      photoUrl: '',
      avatar: {
        color: getGroupAvatarColor(`${groupName}`, theme.colors.avatarColors),
        title: '',
      },
    } as Group;

    const addedGroup = await addGroup(newGroup);
    setGroup(addedGroup);

    // Add group membership to each user (including myself).
    members.forEach(u => {
      if (addedGroup.id) {
        u.groups = u.groups.concat(addedGroup.id);
        updateUser(u);
      }
    });

    return addedGroup;
  };

  const searchFilter = async ({ text, scope }: SearchCriteria) => {
    setSearchCriteria({ text, scope });
    if (text.length >= minimumRequiredCharsForSearch) {
      if (scope === SearchScope.Username) {
        //Case insensitive match.
        const usersByFirstName =
          lodash.filter(userSearchSet, u =>
            u.firstName.toLowerCase().includes(text.toLowerCase()),
          ) || [];
        const usersByLastName =
          lodash.filter(userSearchSet, u =>
            u.lastName.toLowerCase().includes(text.toLowerCase()),
          ) || [];
        const usersByEmail =
          lodash.filter(userSearchSet, u =>
            u.email.toLowerCase().includes(text.toLowerCase()),
          ) || [];

        // Ensure no duplicates in the result.
        const searchResult = lodash.uniqBy(
          usersByFirstName.concat(usersByLastName).concat(usersByEmail),
          'id',
        );

        // Remove users that are already added.
        const filtered = lodash.reject(searchResult, u => {
          return lodash.findIndex(addedUsers, u) >= 0;
        });

        setFilteredUsers(filtered);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const setLatestMessageAsReadByMe = () => {
    if (!myUserProfile?.id || !group) return;

    // This snippet overwrites any previous snippet created by any other group
    // member. We only track the last message sent by anyone.
    if (
      group.latestMessageSnippet &&
      !group.latestMessageSnippet.readBy.includes(myUserProfile.id)
    ) {
      group.latestMessageSnippet.readBy.push(myUserProfile.id);

      const { extended: _extended, ...g } = group; // Remove extended properties.
      updateGroup(g as Group);
    }
  };

  const sendMessage = async (message: MessageType.PartialAny[]) => {
    if (!myUserProfile) return;
    const targetGroup = group || (await createGroup());

    sendMessages(message, myUserProfile, targetGroup, messagesBeingSend => {
      // Add pending messsages to the UI while they are being sent.
      // This provides the user with feedback that the message is uploading.
      // Need to reverse the messagesBeingSent because the chat list is a reversed list.
      const messages = ([] as MessageType.Any[]).concat(
        messagesBeingSend.reverse(),
        chatMessages,
      );
      setChatMessages(messages);
    });

    // Sending messages while composing exits composing mode.
    composingGroup.current = false;
  };

  const handlePreviewDataFetched = ({
    message,
    previewData,
  }: {
    message: MessageType.Text;
    previewData: PreviewData;
  }) => {
    if (!group?.id) return;
    updateChatMessage({ previewData }, message.id, group.id);
  };

  const onInputTextChanged = (text: string) => {
    setTypingState(text);
  };

  const setTypingState = (text?: string) => {
    if (myUserProfile?.id && group?.id) {
      // This logic ensures we send typing updates on state transitions, not on every keystroke.
      if (text && text.length > 0 && !iAmTyping.current) {
        iAmTyping.current = true;
        sendTypingState(
          true,
          myUserProfile.id,
          myUserProfile.firstName,
          group.id,
        );
      } else if ((!text || text.length === 0) && iAmTyping.current) {
        iAmTyping.current = false;
        sendTypingState(
          false,
          myUserProfile.id,
          myUserProfile.firstName,
          group.id,
        );
      }
    }
  };

  const renderHeaderTitle = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return <ChatHeaderTitle group={group!} />;
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={s.emptyListContainer}>
        {isLoading ? <NoItems isLoading /> : <NoItems title={'No messages'} />}
      </View>
    );
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item: userProfile }) => {
    return (
      <ListItem
        title={userProfile.name || userProfile.email}
        titleStyle={s.userProfileTitle}
        leftImage={<ChatAvatar userProfile={userProfile} size={'medium'} />}
        rightImage={false}
        onPress={() => {
          setAddedUsers(addedUsers.concat(userProfile));
          resetSearch();
        }}
      />
    );
  };

  const addedUserChips = () => {
    return addedUsers.map(u => {
      return {
        label: u.name || u.email,
        labelStyle: theme.styles.textSmall,
        dismissColor: theme.colors.text,
        dismissIconStyle: s.userChipDismissIcon,
        onDismiss: () => {
          const current = ([] as UserProfile[]).concat(addedUsers);
          lodash.remove(current, u);
          setAddedUsers(current);
        },
      } as Incubator.ChipsInputChipProps;
    });
  };

  const renderGroupComposer = () => {
    return (
      <Animated.View
        exiting={SlideOutUp.duration(750)}
        style={s.groupComposerContainer}>
        <Incubator.ChipsInput
          leadingAccessory={<Text style={s.toLabel}>{'To:'}</Text>}
          style={s.chipInputText}
          fieldStyle={s.chipInput}
          chips={addedUserChips()}
          // @ts-ignore property is incorrectly typed
          onChange={(_chips, changeReason, updatedChip) => {
            if (changeReason === 'removed') {
              // @ts-ignore property is incorrectly typed
              updatedChip.onDismiss && updatedChip.onDismiss();
            }
          }}
          onChangeText={(text: string) =>
            searchFilter({
              text,
              scope: SearchScope.Username,
            })
          }
          onBlur={() => setSearchFocused(false)}
          onFocus={() => setSearchFocused(true)}
          value={searchCriteria.text}
        />
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={item => `${item.id}`}
          contentInsetAdjustmentBehavior={'automatic'}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      {composingGroup.current && renderGroupComposer()}
      <Chat
        messages={chatMessages}
        user={{
          id: myUserProfile?.id || '',
          firstName: myUserProfile?.firstName,
          lastName: myUserProfile?.lastName,
          imageUrl: myUserProfile?.photoUrl || '',
          avatarColor: myUserProfile?.avatar.color,
        }}
        isLastPage={allLoaded.current}
        isTyping={isTyping}
        typingNames={typingNames.current}
        onSendPress={sendMessage}
        onAttachmentPress={selectAttachments}
        onEndReached={getMoreChatMessages}
        onInputTextChanged={onInputTextChanged}
        onMessagePress={handleMessagePress}
        onPreviewDataFetched={handlePreviewDataFetched}
        showUserAvatars={group && group?.members.length > 2}
        showUserNames={group && group?.members.length <= 2 ? 'none' : 'outside'}
        relativeDateTime={true}
        l10nOverride={{ inputPlaceholder: 'Type message' }}
        disableSend={!group && !addedUsers.length}
        sendButtonVisibilityMode={'always'}
        theme={chatTheme(theme, { tabBarHeight })}
        emptyState={renderListEmptyComponent}
        resolveUrl={resolveUrl}
      />
      <UserPickerModal
        ref={userPickerModalRef}
        multiple
        snapPoints={['65%']}
        onSelect={userProfile => {
          setAddedUsers(addedUsers.concat(userProfile));
        }}
        onDeselect={userProfile => {
          const current = ([] as UserProfile[]).concat(addedUsers);
          lodash.remove(current, u => u.id === userProfile.id);
          setAddedUsers(current);
        }}
        userProfiles={userSearchSet}
        selected={addedUsers}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  emptyListContainer: {
    marginTop: '50%',
  },
  groupComposerContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  chipInput: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.subtleGray,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minHeight: 50,
  },
  chipInputText: {
    ...theme.styles.textNormal,
    flexGrow: undefined,
  },
  userChipDismissIcon: {
    width: 15,
    height: 15,
  },
  toLabel: {
    ...theme.styles.textNormal,
    marginRight: 3,
    marginTop: 14,
  },
  userProfileTitle: {
    left: 20,
  },
}));

export default ChatThreadScreen;
