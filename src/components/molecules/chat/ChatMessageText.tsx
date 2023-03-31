import { MessageText, MessageTextProps } from 'react-native-gifted-chat';

import { ChatMessage } from 'types/chatMessage';
import { useTheme } from 'theme';

export const renderMessageText = (props: MessageTextProps<ChatMessage>) => {
  return <ChatMessageText {...props} />;
};

const ChatMessageText = (props: MessageTextProps<ChatMessage>) => {
  const theme = useTheme();
  return (
    <MessageText
      {...props}
      containerStyle={{
        left: { backgroundColor: theme.colors.subtleGray },
        right: { backgroundColor: theme.colors.brandSecondary },
      }}
      textStyle={{
        left: { ...theme.styles.textNormal, zIndex: 10 },
        right: {
          ...theme.styles.textNormal,
          color: theme.colors.stickyWhite,
          zIndex: 10,
        },
      }}
      linkStyle={{
        left: {
          ...theme.styles.textNormal,
          color: theme.colors.textLink,
          zIndex: 10,
        },
        right: {
          ...theme.styles.textNormal,
          color: theme.colors.textLink,
          zIndex: 10,
        },
      }}
      // customTextStyle={theme.styles.textNormal}
    />
  );
};
