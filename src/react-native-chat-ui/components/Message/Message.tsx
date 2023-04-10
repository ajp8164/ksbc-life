import * as React from 'react';

import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { TextMessage, TextMessageTopLevelProps } from '../TextMessage';
import {
  ThemeContext,
  UserContext,
  excludeDerivedMessageProps,
  getUserName,
} from '../../utils';

import { Avatar } from '../Avatar';
import { FileMessage } from '../FileMessage';
import { ImageMessage } from '../ImageMessage';
import { MessageType } from '../../types';
import { StatusIcon } from '../StatusIcon';
import { UsernameLocation } from '../../types';
import { oneOf } from '@flyerhq/react-native-link-preview';
import styles from './styles';

export interface MessageTopLevelProps extends TextMessageTopLevelProps {
  /** Called when user makes a long press on any message */
  onMessageLongPress?: (message: MessageType.Any) => void;
  /** Called when user taps on any message */
  onMessagePress?: (message: MessageType.Any) => void;
  /** Customize the default bubble using this function. `child` is a content
   * you should render inside your bubble, `message` is a current message
   * (contains `author` inside) and `nextMessageInGroup` allows you to see
   * if the message is a part of a group (messages are grouped when written
   * in quick succession by the same author) */
  renderBubble?: (payload: {
    child: React.ReactNode;
    message: MessageType.Any;
    nextMessageInGroup: boolean;
  }) => React.ReactNode;
  /** Render a custom message inside predefined bubble */
  renderCustomMessage?: (
    message: MessageType.Custom,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render a file message inside predefined bubble */
  renderFileMessage?: (
    message: MessageType.File,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render an image message inside predefined bubble */
  renderImageMessage?: (
    message: MessageType.Image,
    messageWidth: number,
  ) => React.ReactNode;
  /** Render a text message inside predefined bubble */
  renderTextMessage?: (
    message: MessageType.Text,
    messageWidth: number,
    showName: UsernameLocation,
  ) => React.ReactNode;
  /** Show user avatars for received messages. Useful for a group chat. */
  showUserAvatars?: boolean;

  onLayout?: (event: LayoutChangeEvent) => void;
}

export interface MessageProps extends MessageTopLevelProps {
  enableAnimation?: boolean;
  message: MessageType.DerivedAny;
  messageWidth: number;
  roundBorder: boolean;
  showAvatar: boolean;
  showName: UsernameLocation;
  showStatus: boolean;
}

/** Base component for all message types in the chat. Renders bubbles around
 * messages and status. Sets maximum width for a message for
 * a nice look on larger screens. */
export const Message = React.memo(
  ({
    enableAnimation,
    message,
    messageWidth,
    onLayout,
    onMessagePress,
    onMessageLongPress,
    onPreviewDataFetched,
    renderBubble,
    renderCustomMessage,
    renderFileMessage,
    renderImageMessage,
    renderTextMessage,
    roundBorder,
    showAvatar,
    showName,
    showStatus,
    showUserAvatars,
    usePreviewData,
  }: MessageProps) => {
    const theme = React.useContext(ThemeContext);
    const user = React.useContext(UserContext);

    const currentUserIsAuthor =
      message.type !== 'dateHeader' && user?.id === message.author.id;

    const { container, contentContainer, dateHeader, pressable, username } =
      styles({
        currentUserIsAuthor,
        message,
        messageWidth,
        roundBorder,
        theme,
      });

    if (message.type === 'dateHeader') {
      return (
        <View style={dateHeader}>
          <Text style={theme.date.text}>{message.text}</Text>
        </View>
      );
    }

    const renderBubbleContainer = () => {
      const child = renderMessage();
      return oneOf(
        renderBubble,
        <>
          <View style={contentContainer} testID="ContentContainer">
            {child}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {showStatus && (
              <StatusIcon
                {...{
                  currentUserIsAuthor,
                  status: message.status,
                  theme,
                }}
              />
            )}
          </View>
        </>,
      )({
        child,
        message: excludeDerivedMessageProps(message),
        nextMessageInGroup: roundBorder,
      });
    };

    const renderMessage = () => {
      switch (message.type) {
        case 'custom':
          return (
            renderCustomMessage?.(
              // It's okay to cast here since we checked message type above
              // type-coverage:ignore-next-line
              excludeDerivedMessageProps(message) as MessageType.Custom,
              messageWidth,
            ) ?? null
          );
        case 'file':
          return oneOf(renderFileMessage, <FileMessage message={message} />)(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.File,
            messageWidth,
          );
        case 'image':
          return oneOf(
            renderImageMessage,
            <ImageMessage
              {...{
                message,
                messageWidth,
              }}
            />,
          )(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.Image,
            messageWidth,
          );
        case 'text':
          return oneOf(
            renderTextMessage,
            <TextMessage
              {...{
                enableAnimation,
                message,
                messageWidth,
                onPreviewDataFetched,
                showName,
                usePreviewData,
              }}
            />,
          )(
            // type-coverage:ignore-next-line
            excludeDerivedMessageProps(message) as MessageType.Text,
            messageWidth,
            showName,
          );
        default:
          return null;
      }
    };

    const renderUsername = () => {
      return (
        <Text numberOfLines={1} style={theme.bubble.headerText}>
          {getUserName(message.author)}
        </Text>
      );
    };

    return (
      <>
        <View style={container} onLayout={onLayout}>
          <Avatar
            {...{
              author: message.author,
              currentUserIsAuthor,
              showAvatar,
              showUserAvatars,
              theme,
            }}
          />
          <Pressable
            onLongPress={() =>
              onMessageLongPress?.(excludeDerivedMessageProps(message))
            }
            onPress={() =>
              onMessagePress?.(excludeDerivedMessageProps(message))
            }
            style={pressable}>
            {renderBubbleContainer()}
          </Pressable>
        </View>
        <View style={username}>
          {showName === 'outside' ? renderUsername() : null}
        </View>
      </>
    );
  },
);
