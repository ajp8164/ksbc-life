import { Chat, MessageType } from '../react-native-chat-ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  chatMessagesDocumentChangeListener,
  sendTypingState,
} from 'firestore/chatMessages';
import {
  chatTheme,
  handleMessagePress,
  renderHeader,
  sendTextMessage,
  useSendAttachment,
} from 'components/molecules/chat';

import { ChatMessage } from 'types/chat';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import lodash from 'lodash';
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

  const sendAttachmentMessage = useSendAttachment();

  const tabBarHeight = useBottomTabBarHeight();
  const recipient = route.params.recipient;
  const userProfile = useSelector(selectUserProfile);
  const threadId = useRef<string>();
  const isInitializing = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<MessageType.Any[]>([]);

  //////////////////////////////
  // const renderBubble = ({
  //   child,
  //   message,
  //   nextMessageInGroup,
  // }: {
  //   child: ReactNode;
  //   message: MessageType.Any;
  //   nextMessageInGroup: boolean;
  // }) => {
  //   if (message.type !== 'custom') {
  //     return (
  //       <View
  //         style={{
  //           backgroundColor:
  //             user.id !== message.author.id ? '#ffffff' : '#1d1c21',
  //           borderBottomLeftRadius:
  //             !nextMessageInGroup && user.id !== message.author.id ? 20 : 0,
  //           borderBottomRightRadius:
  //             !nextMessageInGroup && user.id === message.author.id ? 20 : 0,
  //           borderColor: '#1d1c21',
  //           borderWidth: 1,
  //           overflow: 'hidden',
  //         }}>
  //         {child}
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View
  //         style={{
  //           borderColor: '#ff9900',
  //           borderWidth: 2,
  //           overflow: 'hidden',
  //         }}>
  //         {child}
  //       </View>
  //     );
  //   }
  // };

  // const renderCustomMessage = (
  //   message: MessageType.Custom,
  //   messageWidth: number,
  // ) => {
  //   console.log(message, messageWidth);
  //   return (
  //     <View
  //       style={{
  //         borderColor: '#1d1c21',
  //         borderWidth: 1,
  //         overflow: 'hidden',
  //       }}>
  //       <Text style={{ width: 100 || messageWidth }}>
  //         {message?.metadata?.custom}
  //       </Text>
  //     </View>
  //   );
  // };
  //////////////////////////////

  useEffect(() => {
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
          const rawMessages =
            (data.messages as { [key in string]: ChatMessage }) || [];
          const isTyping = (data.isTyping as string[]) || [];

          const messages = Object.keys(rawMessages)
            .map(key => {
              // Convert server timestamp to be compatible with GiftedChat (javascript ms timestamp).
              rawMessages[key].createdAt =
                (rawMessages[key].createdAt as FirebaseFirestoreTypes.Timestamp)
                  .seconds * 1000;

              // rawMessages[key].received = false; // Reset all message received status.
              // rawMessages[key].sent = false; // Reset all message sent status.
              return rawMessages[key] as ChatMessage;
            })
            .sort((a, b) => {
              return (b.createdAt as number) - (a.createdAt as number);
            });

          // Use the last message in the list to set status.
          // This status is used to create a status message and space at the end of the list.
          if (messages[0].author.id === userProfile?.id) {
            // messages[0].sent = true;
          } else {
            // messages[0].received = true;
          }

          messages[1].status = 'seen';
          setChatMessages(messages);

          // Set typing state on our ui,
          const othersTyping = lodash.reject(isTyping, el => {
            return el === userProfile?.id;
          });
          setIsTyping(othersTyping.length > 0);
        }
      },
    );
    return () => {
      subscription();

      if (userProfile?.id && threadId.current) {
        // Make sure we stop typing when the view is dismissed.
        sendTypingState(false, userProfile.id, threadId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      header: () => renderHeader(recipient),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        sendTypingState(true, userProfile.id, threadId.current);
      } else if (text.length === 0 && iAmTyping.current) {
        iAmTyping.current = false;
        sendTypingState(false, userProfile.id, threadId.current);
      }
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      {userProfile?.id ? (
        <Chat
          messages={chatMessages}
          user={{
            id: userProfile.id,
            firstName: userProfile.name?.split(' ')[0] || userProfile.email[0],
            lastName: userProfile.name?.split(' ')[1] || '',
            imageUrl: userProfile.photoUrl || '',
            avatarColor: userProfile.avatar.color,
          }}
          onSendPress={sendText}
          onAttachmentPress={sendAttachment}
          onMessagePress={handleMessagePress}
          showUserAvatars={true} //  Only if group
          showUserNames={'outside'}
          theme={chatTheme(theme, { tabBarHeight })}
          // renderBubble={renderBubble}
          // renderCustomMessage={renderCustomMessage}
          // customBottomComponent={() => <Text>hello</Text>}
        />
      ) : (
        <InfoMessage text={'User id not found'} />
      )}
    </SafeAreaView>
  );
};

export default ChatThreadScreen;
