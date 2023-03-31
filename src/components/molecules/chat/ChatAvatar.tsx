import { Avatar, AvatarProps } from 'react-native-gifted-chat';
import { Text, View } from 'react-native';

import { ChatMessage } from 'types/chatMessage';
import { Icon } from '@rneui/base';
import { useTheme } from 'theme';

export const renderAvatar = (props: AvatarProps<ChatMessage>) => {
  return <ChatAvatar {...props} />;
};

const ChatAvatar = (props: AvatarProps<ChatMessage>) => {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 20 }}>
      {typeof props.currentMessage?.user?.avatar === 'string' &&
      props.currentMessage?.user.avatar?.length > 0 ? (
        <Avatar
          {...props}
          containerStyle={{
            left: {},
            right: {},
          }}
          imageStyle={{
            left: {},
            right: {},
          }}
        />
      ) : (
        <Icon
          name={'account-circle-outline'}
          type={'material-community'}
          color={theme.colors.icon}
          size={40}
          style={{}}
        />
      )}
      <Text
        style={[
          {
            ...theme.styles.textMicro,
            color: theme.colors.midGray,
            position: 'absolute',
            bottom: -20,
            width: 125,
          },
        ]}>
        {props.currentMessage?.user.name}
      </Text>
    </View>
  );
};
