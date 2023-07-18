import { Button, Icon } from '@rneui/base';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  chatMessagesCollectionChangeListener,
  getChatMessages,
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

import ChatGroupComposer from 'components/views/ChatGroupComposer';
import { ChatGroupComposerMethods } from 'components/views/ChatGroupComposer';
import { ChatHeaderTitle } from 'components/molecules/ChatHeaderTitle';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirestoreMessageType } from 'types/chat';
import { Group } from 'types/group';
import { Keyboard } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { PreviewData } from '@flyerhq/react-native-link-preview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import notifee from '@notifee/react-native';
import { resolveUrl } from 'lib/fileCache';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const chatGroupComposerRef = useRef<ChatGroupComposerMethods>(null);
  const selectAttachments = useSelectAttachments();

  const [group, setGroup] = useState(route.params.group);
  const myGroups = useRef(route.params.myGroups);
  const composingGroup = useRef(lodash.isEmpty(route.params.group));
  const [groupComposerHasRecipients, setGroupComposerHasRecipients] =
    useState(false);
  const myUserProfile = useSelector(selectUserProfile);
  const [isTyping, setIsTyping] = useState(false);
  const typingNames = useRef<string | undefined>();
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<MessageType.Any[]>([]);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();

  // Set the group header or composer header.
  useEffect(() => {
    if (composingGroup.current) {
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
              chatGroupComposerRef.current?.presentUserPicker();
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

  // If this view is visible during sign out then we pop it off the navigation stack.
  useEffect(() => {
    if (!myUserProfile) {
      navigation.dispatch(StackActions.popToTop());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserProfile]);

  // Group listener - listen for group message snippet changes while viewing this thread so
  // we can mark any messages that arrive as being read by me.
  useEffect(() => {
    if (!group?.id) return;
    const subscription = groupsDocumentChangeListener(
      group.id,
      async snapshot => {
        setGroup({
          ...group,
          latestMessageSnippet: (snapshot.data() as Group).latestMessageSnippet,
        });
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLatestMessageAsReadByMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.latestMessageSnippet]);

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

  const onComposerChanged = (
    selectedGroup?: Group,
    userProfiles?: UserProfile[],
  ) => {
    setGroup(selectedGroup);
    if (!selectedGroup) {
      setChatMessages([]);
      setGroupComposerHasRecipients(userProfiles?.length !== 0);
    }
  };

  const sendMessage = async (message: MessageType.PartialAny[]) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { extended: _extended, ...g } = group!; // Remove extended properties.

    const targetGroup =
      g || (await chatGroupComposerRef.current?.createGroup());

    if (!myUserProfile || !targetGroup) return;

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
    return isLoading ? (
      <NoItems isLoading />
    ) : (
      <NoItems title={'No messages'} />
    );
  };

  if (!myUserProfile) {
    return null;
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <ChatGroupComposer
        ref={chatGroupComposerRef}
        myUserProfile={myUserProfile}
        myGroups={myGroups.current}
        onComposerChanged={onComposerChanged}
        visible={composingGroup.current}
      />
      <Chat
        messages={chatMessages}
        user={{
          id: myUserProfile.id || '',
          firstName: myUserProfile.firstName,
          lastName: myUserProfile.lastName,
          imageUrl: myUserProfile.photoUrl || '',
          avatarColor: myUserProfile.avatar.color,
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
        disableSend={!group && !groupComposerHasRecipients}
        sendButtonVisibilityMode={'always'}
        theme={chatTheme(theme, { tabBarHeight })}
        emptyState={renderListEmptyComponent}
        resolveUrl={resolveUrl}
      />
    </SafeAreaView>
  );
};

export default ChatThreadScreen;
