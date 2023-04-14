import { AppTheme, useTheme } from 'theme';
import { Avatar, Button, Icon } from '@rneui/base';
import { Chat, MessageType } from '../react-native-chat-ui';
import {
  ChatHeader,
  chatTheme,
  handleMessagePress,
  sendTextMessage,
  useSendAttachment,
} from 'components/molecules/chat';
import { FirestoreMessageType, SearchCriteria, SearchScope } from 'types/chat';
import { FlatList, Keyboard, ListRenderItem, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  chatMessagesDocumentChangeListener,
  sendTypingState,
  updateChatMessage,
} from 'firebase/firestore/chatMessages';

import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Incubator } from 'react-native-ui-lib';
import { ListItem } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPickerModal } from 'components/modals/UserPickerModal';
import { UserProfile } from 'types/user';
import { getUsers } from 'firebase/firestore/users';
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
  const recipient = route.params.recipient;
  const newThread = !recipient;
  const userProfile = useSelector(selectUserProfile);
  const threadId = useRef<string>();
  const isInitializing = useRef(true);
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
    if (!recipient) return;

    // Create the chat thread id by combining recipient and sender id's. Use a comparison to get the
    // same id everytime.
    if (userProfile?.id && recipient.id) {
      threadId.current =
        userProfile?.id < recipient.id
          ? `${userProfile?.id}-${recipient.id}`
          : `${recipient.id}-${userProfile?.id}`;
    }
    if (!threadId.current) return;

    const subscription = chatMessagesDocumentChangeListener(
      threadId.current,
      snapshot => {
        const data = snapshot.data();
        if (!snapshot.metadata.hasPendingWrites && data) {
          const rawMessages = (data.messages as FirestoreMessageType) || [];
          const typingState =
            (data.isTyping as { [key in string]: string }[]) || [];

          const messages = Object.keys(rawMessages)
            .map(key => {
              // Convert server timestamps to be compatible with chat library (javascript ms timestamp).
              rawMessages[key].createdAt =
                (rawMessages[key].createdAt as FirebaseFirestoreTypes.Timestamp)
                  .seconds * 1000;

              if (rawMessages[key].updatedAt) {
                rawMessages[key].updatedAt =
                  (
                    rawMessages[key]
                      .updatedAt as FirebaseFirestoreTypes.Timestamp
                  ).seconds * 1000;
              }
              return rawMessages[key] as MessageType.Any;
            })
            .sort((a, b) => {
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
            threadId.current &&
              updateChatMessage('status', messages[0], threadId.current);
          }

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

          setChatMessages(messages);
        }
      },
    );
    return () => {
      subscription();

      if (userProfile?.id && threadId.current) {
        // Make sure we stop typing when the view is dismissed.
        sendTypingState(
          false,
          userProfile.id,
          userProfile.firstName,
          threadId.current,
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recipient) {
      navigation.setOptions({
        header: () => renderHeader(recipient),
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
  }, []);

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

  const sendAttachment = () => {
    if (!userProfile || !threadId.current) return;
    sendAttachmentMessage(userProfile, threadId.current);
  };

  const sendText = (message: MessageType.PartialText) => {
    if (!userProfile || !threadId.current) return;
    sendTextMessage(message, userProfile, threadId.current);
  };

  const onInputTextChanged = (text: string) => {
    setTypingState(text);
    // The first time text is entered we declare that initial message loading is complete.
    if (text.length > 0) {
      isInitializing.current = false;
    }
  };

  const setTypingState = (text: string) => {
    if (userProfile?.id && threadId.current) {
      // This logic ensures we send typing updates on state transitions, not on every keystroke.
      if (text.length > 0 && !iAmTyping.current) {
        iAmTyping.current = true;
        sendTypingState(
          true,
          userProfile.id,
          userProfile.firstName,
          threadId.current,
        );
      } else if (text.length === 0 && iAmTyping.current) {
        iAmTyping.current = false;
        sendTypingState(
          false,
          userProfile.id,
          userProfile.firstName,
          threadId.current,
        );
      }
    }
  };

  const renderHeader = (recipient: UserProfile) => {
    return <ChatHeader userProfile={recipient} />;
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item }) => {
    return (
      <ListItem
        title={item.name || item.email}
        leftImage={
          item.photoUrl ? (
            <Avatar
              source={{ uri: item.photoUrl }}
              imageProps={{ resizeMode: 'contain' }}
              containerStyle={theme.styles.avatar}
            />
          ) : (
            <Avatar
              title={item.avatar.title}
              titleStyle={[theme.styles.avatarTitle]}
              containerStyle={{
                ...theme.styles.avatar,
                backgroundColor: item.avatar.color,
              }}
            />
          )
        }
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
          console.log(current);
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
      {newThread && (
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
            style={{
              height:
                searchFocused || addedUsers.length === 0 ? '100%' : undefined,
            }}
            contentInsetAdjustmentBehavior={'automatic'}
          />
        </View>
      )}
      {!searchFocused && addedUsers.length > 0 && userProfile?.id && (
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
          showUserAvatars={true} //  Only if group
          showUserNames={'outside'}
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
