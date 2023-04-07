import { StyleSheet } from 'react-native'

import { MessageType, Theme, User } from '../../types'

const styles = ({
  aspectRatio,
  message,
  messageWidth,
  theme,
  user,
}: {
  aspectRatio: number
  message: MessageType.Image
  messageWidth: number
  theme: Theme
  user?: User
}) =>
  StyleSheet.create({
    horizontalImage: {
      height: messageWidth / aspectRatio,
      maxHeight: messageWidth,
      width: messageWidth,
    },
    minimizedImage: {
      borderRadius: 15,
      height: 64,
      marginLeft: theme.bubble.messageInsetsVertical,
      marginRight: 16,
      marginVertical: theme.bubble.messageInsetsVertical,
      width: 64,
    },
    minimizedImageContainer: {
      alignItems: 'center',
      backgroundColor:
        user?.id === message.author.id
          ? theme.colors.primary
          : theme.colors.secondary,
      flexDirection: 'row',
    },
    nameText:
      user?.id === message.author.id
        ? theme.fonts.sentMessageBodyTextStyle
        : theme.fonts.receivedMessageBodyTextStyle,
    sizeText: {
      ...(user?.id === message.author.id
        ? theme.fonts.sentMessageCaptionTextStyle
        : theme.fonts.receivedMessageCaptionTextStyle),
      marginTop: 4,
    },
    textContainer: {
      flexShrink: 1,
      marginRight: theme.bubble.messageInsetsHorizontal,
      marginVertical: theme.bubble.messageInsetsVertical,
    },
    verticalImage: {
      height: messageWidth,
      minWidth: 170,
      width: messageWidth * aspectRatio,
    },
  })

export default styles
