import { Bubble, MessageTextProps, Time } from 'react-native-gifted-chat';

import { ChatMessage } from 'types/chatMessage';
import { Text } from 'react-native';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';

export const renderBubble = (props: MessageTextProps<ChatMessage>) => {
  return <ChatBubble {...props} />;
};

const bubbleRadius = 15;
const bubbleBorderWidth = 5;

const ChatBubble = (props: MessageTextProps<ChatMessage>) => {
  const theme = useTheme();
  const userProfile = useSelector(selectUserProfile);
  return (
    <Bubble
      {...props}
      containerStyle={{
        left: { marginBottom: 20 },
        right:
          props.currentMessage?.user._id === userProfile?.id &&
          props.currentMessage?.sent
            ? { marginBottom: 20 }
            : {},
      }}
      wrapperStyle={{
        left: {
          backgroundColor: theme.colors.subtleGray,
          borderColor: theme.colors.subtleGray,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderBottomLeftRadius: 0,
          maxWidth: '75%',
        },
        right: {
          backgroundColor: theme.colors.brandSecondary,
          borderColor: theme.colors.brandSecondary,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderBottomRightRadius: 0,
          maxWidth: '75%',
        },
      }}
      bottomContainerStyle={{
        left: {
          backgroundColor: theme.colors.subtleGray,
        },
        right: {
          backgroundColor: theme.colors.brandSecondary,
        },
      }}
      containerToNextStyle={{
        left: {
          borderColor: theme.colors.subtleGray,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderBottomLeftRadius: 0,
        },
        right: {
          borderColor: theme.colors.brandSecondary,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderBottomRightRadius: 0,
        },
      }}
      containerToPreviousStyle={{
        left: {
          borderColor: theme.colors.subtleGray,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderTopLeftRadius: bubbleRadius,
          borderBottomLeftRadius: 0,
        },
        right: {
          borderColor: theme.colors.brandSecondary,
          borderWidth: bubbleBorderWidth,
          borderRadius: bubbleRadius,
          borderTopRightRadius: bubbleRadius,
          borderBottomRightRadius: 0,
        },
      }}
      renderTime={props => (
        <Time
          {...props}
          timeTextStyle={{
            left: {
              ...theme.styles.textMicro,
              color: theme.colors.midGray,
            },
            right: {
              ...theme.styles.textMicro,
              color: theme.colors.stickyWhite,
            },
          }}
        />
      )}
      renderTicks={currentMessage => (
        <Text
          style={{
            ...theme.styles.textMicro,
            color: theme.colors.midGray,
            position: 'absolute',
            bottom: -20,
          }}>
          {currentMessage?.user._id === userProfile?.id && currentMessage?.sent
            ? 'Sent'
            : ''}
        </Text>
      )}
    />
  );
};
