import { MessageType, Theme, User } from '../../types';

import { StyleSheet } from 'react-native';

const styles = ({
  message,
  theme,
  user,
}: {
  message: MessageType.DerivedFile;
  theme: Theme;
  user?: User;
}) => {
  const restContainer =
    user?.id === message.author.id
      ? theme.bubble.fileRightContainer
      : theme.bubble.fileLeftContainer;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      ...restContainer,
    },
    icon: {
      tintColor:
        user?.id === message.author.id
          ? theme.bubble.documentIconRightColor
          : theme.bubble.documentIconLeftColor,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor:
        user?.id === message.author.id
          ? `${String(theme.bubble.documentIconRightColor)}33`
          : `${String(theme.bubble.documentIconLeftColor)}33`,
      borderRadius: 21,
      height: 42,
      justifyContent: 'center',
      width: 42,
    },
    name:
      user?.id === message.author.id
        ? theme.bubble.bodyTextRight
        : theme.bubble.bodyTextLeft,
    size: {
      ...(user?.id === message.author.id
        ? theme.bubble.captionTextRight
        : theme.bubble.captionTextLeft),
      marginTop: 4,
    },
    textContainer: {
      flexShrink: 1,
      marginLeft: 16,
    },
  });
};

export default styles;
