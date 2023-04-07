import { MessageType, Theme } from '../../types';

import { StyleSheet } from 'react-native';

const styles = ({
  currentUserIsAuthor,
  message,
  messageWidth,
  roundBorder,
  theme,
}: {
  currentUserIsAuthor: boolean;
  message: MessageType.DerivedAny;
  messageWidth: number;
  roundBorder: boolean;
  theme: Theme;
}) => {
  const restContentContainer = currentUserIsAuthor
    ? theme.bubble.contentRightContainer
    : theme.bubble.contentLeftContainer;

  return StyleSheet.create({
    container: {
      alignItems: 'flex-end',
      alignSelf: currentUserIsAuthor ? 'flex-end' : 'flex-start',
      justifyContent: !currentUserIsAuthor ? 'flex-end' : 'flex-start',
      flex: 1,
      flexDirection: 'row',
      marginBottom: message.type === 'dateHeader' ? 0 : 4 + message.offset,
      marginLeft: 20,
    },
    contentContainer: {
      overflow: 'hidden',
      borderBottomLeftRadius:
        currentUserIsAuthor || roundBorder
          ? theme.bubble.contentRightContainer.borderBottomLeftRadius
          : 0,
      borderBottomRightRadius: currentUserIsAuthor
        ? roundBorder
          ? theme.bubble.contentRightContainer.borderBottomRightRadius
          : 0
        : theme.bubble.contentLeftContainer.borderBottomLeftRadius,
      borderColor: 'transparent',
      borderRadius: currentUserIsAuthor
        ? theme.bubble.contentRightContainer.borderRadius
        : theme.bubble.contentLeftContainer.borderRadius,
      ...restContentContainer,
    },
    dateHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      marginTop: 16,
    },
    pressable: {
      maxWidth: messageWidth,
    },
    username: {
      // Avatar - marginLeft + width + marginRight + some additional padding
      marginLeft: 20 + 32 + 8 + 10,
    },
  });
};

export default styles;
