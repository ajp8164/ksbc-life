import { AppTheme, useTheme } from 'theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  addChatMessage,
  chatMessagesDocumentChangeListener,
} from 'firestore/chatMessages';

import ChatHeader from 'components/molecules/ChatHeader';
import { ChatMessage } from 'types/chatMessage';
import { ChatNavigatorParamList } from 'types/navigation';
import { GiftedChat } from 'react-native-gifted-chat';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
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

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
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
          const messages = Object.keys(data)
            .map(key => {
              // Convert server timestamp to be compatible with GiftedChat.
              data[key].createdAt = data[key].createdAt.seconds * 1000;
              return data[key] as ChatMessage;
            })
            .sort((a, b) => {
              return (b.createdAt as number) - (a.createdAt as number);
            });
          setChatMessages(messages);
        }
      },
    );
    return subscription;
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
    threadId.current && addChatMessage(messages[0], threadId.current);
  }, []);

  console.log('chatMessages', chatMessages);
  return (
    <View style={{ flex: 1 }}>
      {userProfile?.id ? (
        <GiftedChat
          messages={chatMessages}
          onSend={onSend}
          user={{
            _id: userProfile?.id,
            name: userProfile.name,
            avatar: userProfile.photoUrl,
          }}
          bottomOffset={78}
        />
      ) : (
        <InfoMessage text={'User id not found'} />
      )}
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default ChatThreadScreen;
