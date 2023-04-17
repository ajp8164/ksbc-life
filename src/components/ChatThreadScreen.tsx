import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import { FirestoreMessageType, SearchCriteria, SearchScope } from 'types/chat';
import { FlatList, Keyboard, ListRenderItem, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  addGroup,
  groupsDocumentChangeListener,
} from 'firebase/firestore/groups';
import {
  chatMessagesCollectionChangeListener,
  sendTypingState,
  updateChatMessage,
} from 'firebase/firestore/chatMessages';
import {
  chatTheme,
  handleMessagePress,
  sendTextMessage,
  useSendAttachment,
} from 'lib/chat';
import { getGroupAvatarColor, getGroupMembersStr } from 'lib/group';
import { getUsers, updateUser } from 'firebase/firestore/users';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ChatHeader } from 'components/molecules/ChatHeader';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Group } from 'types/group';
import { Incubator } from 'react-native-ui-lib';
import { ListItem } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPickerModal } from 'components/modals/UserPickerModal';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';
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

  const sendAttachmentMessage = useSendAttachment();

  const tabBarHeight = useBottomTabBarHeight();
  const [group, setGroup] = useState(route.params.group);
  const userProfile = useSelector(selectUserProfile);
  const initialized = useRef(false);
  const isTyping = useRef(false);
  const typingNames = useRef<string | undefined>();
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<MessageType.Any[]>([]);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(
    initialSearchCriteria,
  );
  const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [userSearchSet, setUserSearchSet] = useState<UserProfile[]>([]);
  const userPickerModalRef = useRef<UserPickerModal>(null);

  useEffect(() => {
    if (!group?.id) return;
    const subscription = chatMessagesCollectionChangeListener(
      group?.id,
      snapshot => {
        if (snapshot.metadata.hasPendingWrites || snapshot.empty) return;

        const messages: MessageType.Any[] = [];
        snapshot.docs.forEach(d => {
          const msg = d.data() as FirestoreMessageType;
          // Convert server timestamps to be compatible with chat library (javascript ms timestamp).
          msg.createdAt =
            (msg.createdAt as FirebaseFirestoreTypes.Timestamp).seconds * 1000;

          if (msg.updatedAt) {
            msg.updatedAt =
              (msg.updatedAt as FirebaseFirestoreTypes.Timestamp).seconds *
              1000;
          }
          messages.push(msg as MessageType.Any);
        });

        if (!snapshot.metadata.hasPendingWrites && messages) {
          messages.sort((a, b) => {
            return (b.createdAt as number) - (a.createdAt as number);
          });

          // Use the latest message in the list to set status.
          if (
            messages[0].author.id === userProfile?.id &&
            messages[0].status !== 'seen'
          ) {
            messages[0].status = 'delivered';
          } else if (messages[0].status !== 'seen') {
            messages[0].status = 'seen';

            group?.id &&
              updateChatMessage(
                { status: messages[0].status },
                messages[0].id,
                group.id,
              );
          }

          setChatMessages(messages);
          initialized.current = true;
        }
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.id]);

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
        return el[userProfile?.id || ''] !== undefined;
      });

      isTyping.current = Object.keys(othersTyping).length > 0;
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

      setGroup(doc);
    });
    return () => {
      subscription();

      if (userProfile?.id && group.id) {
        // Make sure we stop typing when the view is dismissed.
        sendTypingState(false, userProfile.id, userProfile.firstName, group.id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.id]);

  useEffect(() => {
    if (group) {
      navigation.setOptions({
        header: () => renderHeader(group),
      });
    } else {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

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
    const members = [userProfile!].concat(addedUsers);
    const memberIds = members.map(u => {
      return u.id;
    }) as string[];
    const groupName = getGroupMembersStr(memberIds); // Exclude me.

    const newGroup = {
      createdBy: userProfile?.id,
      name: '', // A custom name other than a list of members.
      type: 'private',
      members: memberIds,
      leaders: [userProfile?.id],
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
        const usersFirstName = lodash.filter(userSearchSet, u =>
          u.firstName.toLowerCase().includes(text.toLowerCase()),
        );
        const usersLastName = lodash.filter(userSearchSet, u =>
          u.lastName.toLowerCase().includes(text.toLowerCase()),
        );

        // Ensure no duplicates in the result.
        const searchResult = lodash.uniqBy(
          usersFirstName.concat(usersLastName ? usersLastName : []),
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

  const sendAttachment = async () => {
    if (!userProfile) return;

    let newGroup: Group;
    if (!group) {
      newGroup = await createGroup();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sendAttachmentMessage(userProfile, group || newGroup!);
  };

  const sendText = async (message: MessageType.PartialText) => {
    if (!userProfile) return;

    let newGroup: Group;
    if (!group) {
      newGroup = await createGroup();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sendTextMessage(message, userProfile, group || newGroup!);
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

  const setTypingState = (text: string) => {
    if (userProfile?.id && group?.id) {
      // This logic ensures we send typing updates on state transitions, not on every keystroke.
      if (text.length > 0 && !iAmTyping.current) {
        iAmTyping.current = true;
        sendTypingState(true, userProfile.id, userProfile.firstName, group.id);
      } else if (text.length === 0 && iAmTyping.current) {
        iAmTyping.current = false;
        sendTypingState(false, userProfile.id, userProfile.firstName, group.id);
      }
    }
  };

  const renderHeader = (group: Group) => {
    return <ChatHeader group={group} />;
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item }) => {
    return (
      <ListItem
        title={item.name || item.email}
        leftImage={<ChatAvatar userProfile={item} size={'medium'} />}
        rightImage={false}
        onPress={() => {
          setAddedUsers(addedUsers.concat(item));
          resetSearch();
        }}
      />
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={s.emptyListContainer}>
        <NoItems title={'No messages'} />
      </View>
    );
  };

  const addedUserChips = () => {
    const chips = addedUsers.map(u => {
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
      };
    });

    // Use a stylized chip for the "To:" label since the components leftElement forces
    // an undesirable left indent for all wrapped rows or chips.
    return [
      {
        label: 'To:',
        labelStyle: s.toLabel,
        style: s.toLabelContainer,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].concat(chips as any);
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      {!group && (
        <View style={{}}>
          <Incubator.ChipsInput
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
            // }}
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
        </View>
      )}
      {userProfile?.id && (
        <Chat
          messages={chatMessages}
          user={{
            id: userProfile.id,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            imageUrl: userProfile.photoUrl || '',
            avatarColor: userProfile.avatar.color,
          }}
          isTyping={isTyping.current}
          typingNames={typingNames.current}
          onSendPress={sendText}
          onAttachmentPress={sendAttachment}
          onInputTextChanged={onInputTextChanged}
          onMessagePress={handleMessagePress}
          onPreviewDataFetched={handlePreviewDataFetched}
          showUserAvatars={true} // Only if group
          showUserNames={'outside'}
          disableSend={!group && !addedUsers.length}
          sendButtonVisibilityMode={'always'}
          theme={chatTheme(theme, { tabBarHeight })}
          emptyState={renderListEmptyComponent}
        />
      )}
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
  emptyListContainer: {},
  chipInput: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.subtleGray,
    paddingHorizontal: 10,
    paddingVertical: 7,
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
    marginTop: 3,
  },
  toLabelContainer: {
    marginLeft: -10,
    marginRight: -5,
  },
}));

export default ChatThreadScreen;
