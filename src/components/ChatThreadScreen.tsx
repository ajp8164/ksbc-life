/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppTheme, useTheme } from 'theme';
import React, { useCallback, useEffect, useState } from 'react';

import { ChatNavigatorParamList } from 'types/navigation';
import { GiftedChat } from 'react-native-gifted-chat';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThread'
>;

const ChatThreadScreen = ({ navigation: _navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = [] as any[]) => {
    setMessages((previousMessages: any[]) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
  return (
    <View style={{ flex: 1, marginBottom: 0 }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        bottomOffset={78}
      />
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default ChatThreadScreen;
