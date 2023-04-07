import { MessageType, Theme, User } from '../../types';

import { StyleSheet } from 'react-native';
import { getUserAvatarNameColor } from '../../utils';

const styles = ({
  message,
  theme,
  user,
}: {
  message: MessageType.Text;
  theme: Theme;
  user?: User;
}) =>
  StyleSheet.create({
    descriptionText:
      user?.id === message.author.id
        ? theme.bubble.linkDescriptionTextRight
        : theme.bubble.linkDescriptionTextLeft,
    headerText: {
      ...theme.bubble.headerText,
      color: getUserAvatarNameColor(message.author, theme.avatar.colors),
    },
    titleText:
      user?.id === message.author.id
        ? theme.bubble.linkTitleTextRight
        : theme.bubble.linkTitleTextLeft,
    text:
      user?.id === message.author.id
        ? theme.bubble.messageTextRight
        : theme.bubble.messageTextLeft,
    textContainer:
      user?.id === message.author.id
        ? theme.bubble.textRightContainer
        : theme.bubble.textLeftContainer,
  });

export default styles;
