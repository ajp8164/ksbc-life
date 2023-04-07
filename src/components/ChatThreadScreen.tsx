import { Chat, MessageType, defaultTheme } from '../react-native-chat-ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  addChatMessage,
  chatMessagesDocumentChangeListener,
  sendTypingState,
} from 'firestore/chatMessages';

import { ChatMessage } from 'types/chatMessage';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import lodash from 'lodash';
import { renderHeader } from 'components/molecules/chat';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';
import { uuidv4 } from 'lib/uuid';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();

  const tabBarHeight = useBottomTabBarHeight();
  const recipient = route.params.recipient;
  const userProfile = useSelector(selectUserProfile);
  const threadId = useRef<string>();
  const isInitializing = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<MessageType.Any[]>([]);

  //////////////////////////////
  const handleImageSelection = () => {
    if (!userProfile) return;
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({ assets }) => {
        const response = assets?.[0];

        if (response?.base64) {
          const imageMessage: MessageType.Image = {
            id: uuidv4(),
            author: {
              id: userProfile.id || '',
              firstName:
                userProfile.name?.split(' ')[0] || userProfile.email[0],
              lastName: userProfile.name?.split(' ')[1] || '',
              imageUrl: userProfile.photoUrl || '',
            },
            height: response.height,
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          };
          // addMessage(imageMessage);
          threadId.current && addChatMessage(imageMessage, threadId.current);
        }
      },
    );
  };

  // const handleFileSelection = async () => {
  //   try {
  //     const response = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     const fileMessage: MessageType.File = {
  //       author: user,
  //       createdAt: Date.now(),
  //       id: uuidv4(),
  //       mimeType: response.type ?? undefined,
  //       name: response.name || 'temp',
  //       size: response.size ?? 0,
  //       type: 'file',
  //       uri: response.uri,
  //     };
  //     addMessage(fileMessage);
  //   } catch {}
  // };

  // const handleMessagePress = async (
  //   message: MessageType.DerivedUserMessage,
  // ) => {
  //   if (message.type === 'file') {
  //     try {
  //       await FileViewer.open(message.uri, { showOpenWithDialog: true });
  //     } catch {}
  //   }
  // };

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

  const handleSendPress = (message: MessageType.PartialText) => {
    if (!userProfile) return;
    const textMessage: MessageType.Text = {
      id: uuidv4(),
      author: {
        id: userProfile.id || '',
        firstName: userProfile.name?.split(' ')[0] || userProfile.email[0],
        lastName: userProfile.name?.split(' ')[1] || '',
        imageUrl: userProfile.photoUrl || '',
      },
      text: message.text,
      type: 'text',
    };
    threadId.current && addChatMessage(textMessage, threadId.current);
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
  const [messages, setMessages] = useState([] as MessageType.Any[]);
  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages]);
  };
  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      {userProfile?.id ? (
        <Chat
          messages={chatMessages}
          onSendPress={handleSendPress}
          user={{
            id: userProfile.id,
            firstName: userProfile.name?.split(' ')[0] || userProfile.email[0],
            lastName: userProfile.name?.split(' ')[1] || '',
            imageUrl: userProfile.photoUrl || '',
          }}
          onAttachmentPress={handleImageSelection}
          // onAttachmentPress={handleFileSelection}
          // onMessagePress={handleMessagePress}
          showUserAvatars={true}
          showUserNames={true}
          theme={{
            ...defaultTheme,
            bubble: {
              ...defaultTheme.bubble,
              messageBorderRadius: 12,
              messageInsetsHorizontal: 20,
              messageInsetsVertical: 10,
            },
            colors: {
              ...defaultTheme.colors,
              userAvatarNameColors: ['green'],
            },
            composer: {
              ...defaultTheme.composer,
              contentOffsetKeyboardOpened: 11,
              tabBarHeight,
              container: {
                ...defaultTheme.composer.container,
                backgroundColor: theme.colors.subtleGray,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                paddingVertical: 10,
              },
              inputStyle: {
                ...defaultTheme.composer.inputStyle,
                backgroundColor: theme.colors.white,
                color: theme.colors.text,
                borderRadius: 5,
                paddingHorizontal: 10,
                // height: 30,
              },
            },
          }}
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
