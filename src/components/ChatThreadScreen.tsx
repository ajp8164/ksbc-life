import { AppTheme, useTheme } from 'theme';
import { LayoutAnimation, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addChatMessage,
  chatMessagesDocumentChangeListener,
  sendTypingState,
} from 'firestore/chatMessages';

import ChatHeader from 'components/molecules/ChatHeader';
import { ChatMessage } from 'types/chatMessage';
import { ChatMessageAnimated } from 'components/molecules/ChatMessageAnimated';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const recipient = route.params.recipient;
  const userProfile = useSelector(selectUserProfile);
  const threadId = useRef<string>();
  const [isLoading, setIsLoading] = useState(false);
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
              return rawMessages[key] as ChatMessage;
            })
            .sort((a, b) => {
              return (b.createdAt as number) - (a.createdAt as number);
            });

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
      header: renderHeader,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHeader = () => {
    return <ChatHeader userProfile={recipient} />;
  };

  const onSend = useCallback((messages = [] as ChatMessage[]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    threadId.current && addChatMessage(messages[0], threadId.current);
  }, []);

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
          renderMessage={props => <ChatMessageAnimated {...props} />}
          onSend={onSend}
          user={{
            _id: userProfile?.id,
            name: userProfile.name,
            avatar: userProfile.photoUrl,
          }}
          bottomOffset={78}
          isTyping={isTyping}
          onInputTextChanged={setTypingState}
        />
      ) : (
        <InfoMessage text={'User id not found'} />
      )}
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default ChatThreadScreen;
