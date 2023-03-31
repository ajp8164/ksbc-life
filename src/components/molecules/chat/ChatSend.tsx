import { Send as GCSend, SendProps } from 'react-native-gifted-chat';

import { ChatMessage } from 'types/chatMessage';
import { Icon } from '@rneui/base';
import React from 'react';

export const renderSend = (props: SendProps<ChatMessage>) => {
  return <Send {...props} />;
};

export const Send = (props: SendProps<ChatMessage>) => {
  return (
    <GCSend
      {...props}
      disabled={!props.text}
      containerStyle={{
        justifyContent: 'center',
        marginRight: 10,
      }}>
      <Icon
        name="send-circle-outline"
        type={'material-community'}
        color={'blue'}
        style={{ transform: [{ rotateZ: '-90deg' }] }}
        size={32}
      />
    </GCSend>
  );
};
