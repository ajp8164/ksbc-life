import { AppTheme, useTheme } from 'theme';
import React, { useCallback, useEffect, useState } from 'react';
import {
  addChatMessage,
  chatMessagesDocumentChangeListener,
} from 'firestore/chatMessages';

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

const ChatThreadScreen = ({ navigation: _navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const userProfile = useSelector(selectUserProfile);
  const threadId = `${userProfile?.id}-${route.params.threadId}`;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const subscription = chatMessagesDocumentChangeListener(
      threadId,
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

  const onSend = useCallback((messages = [] as ChatMessage[]) => {
    addChatMessage(messages[0], threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('chatMessages', chatMessages);
  return (
    <View style={{ flex: 1, marginBottom: 0 }}>
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
