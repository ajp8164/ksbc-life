import {
  ChatMessageAnimated,
  renderActions,
  renderAvatar,
  renderBubble,
  renderComposer,
  renderHeader,
  renderMessageText,
  renderSend,
} from 'components/molecules/chat';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addChatMessage,
  chatMessagesDocumentChangeListener,
  sendTypingState,
} from 'firestore/chatMessages';

import { ChatMessage } from 'types/chatMessage';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import lodash from 'lodash';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation, route }: Props) => {
  const recipient = route.params.recipient;
  const userProfile = useSelector(selectUserProfile);
  const threadId = useRef<string>();
  const isInitializing = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const iAmTyping = useRef(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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

              rawMessages[key].received = false; // Reset all message received status.
              rawMessages[key].sent = false; // Reset all message sent status.
              return rawMessages[key] as ChatMessage;
            })
            .sort((a, b) => {
              return (b.createdAt as number) - (a.createdAt as number);
            });

          // Use the last message in the list to set status.
          // This status is used to create a status message and space at the end of the list.
          if (messages[0].user._id === userProfile?.id) {
            messages[0].sent = true;
          } else {
            messages[0].received = true;
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

  const onSend = useCallback((messages = [] as ChatMessage[]) => {
    threadId.current && addChatMessage(messages[0], threadId.current);
  }, []);

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
    <View style={{ flex: 1 }}>
      {userProfile?.id ? (
        <GiftedChat
          messages={chatMessages}
          onInputTextChanged={onInputTextChanged}
          onSend={onSend}
          user={{
            _id: userProfile.id,
            name: userProfile.name || '',
            avatar: userProfile.photoUrl || '',
          }}
          isTyping={isTyping}
          bottomOffset={78}
          renderActions={renderActions}
          renderAvatar={renderAvatar}
          renderBubble={renderBubble}
          renderComposer={renderComposer}
          renderMessageText={renderMessageText}
          renderSend={renderSend}
          renderMessage={props => {
            return (
              <ChatMessageAnimated
                {...{ ...props, isInitializing: isInitializing.current }}
              />
            );
          }}
        />
      ) : (
        <InfoMessage text={'User id not found'} />
      )}
    </View>
  );
};

export default ChatThreadScreen;
