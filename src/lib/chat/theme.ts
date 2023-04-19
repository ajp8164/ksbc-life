import { AppTheme } from 'theme';
import { Icon } from '@rneui/base';
import React from 'react';
import { Theme } from '@flyerhq/react-native-chat-ui';
import { defaultTheme } from '@flyerhq/react-native-chat-ui';

export const chatTheme = (
  theme: AppTheme,
  extra: { tabBarHeight: number },
): Theme => {
  return Object.assign(defaultTheme, {
    avatar: {
      text: {
        ...theme.styles.avatarTitleSmall,
        top: 1.5,
      },
    },
    bubble: {
      captionTextLeft: {
        ...theme.styles.textSmall,
        color: theme.colors.blackTransparentMid,
      },
      captionTextRight: {
        ...theme.styles.textSmall,
        color: theme.colors.whiteTransparentMid,
      },
      contentLeftContainer: {
        backgroundColor: theme.colors.transparent,
        borderWidth: 0.5,
        borderColor: theme.colors.black,
        borderRadius: 20,
      },
      contentRightContainer: {
        backgroundColor: theme.colors.brandPrimary,
        borderRadius: 20,
      },
      documentIconLeftColor: theme.colors.brandPrimary,
      documentIconRightColor: theme.colors.stickyWhite,
      messageTextLeft: {
        ...theme.styles.textNormal,
      },
      messageTextRight: {
        ...theme.styles.textNormal,
        color: theme.colors.textInv,
      },
      headerText: {},
      textLeftContainer: {
        marginHorizontal: 15,
        marginVertical: 8,
      },
      textRightContainer: {
        marginHorizontal: 15,
        marginVertical: 8,
      },
      username: {
        ...theme.styles.textTiny,
        ...theme.styles.textBold,
        color: theme.colors.brandSecondary,
      },
    },
    colors: {},
    composer: {
      activityIndicator: {
        color: theme.colors.brandPrimary,
      },
      contentOffsetKeyboardOpened: 59, // This values should be adjusted if the design height of the composer changes.
      container: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      inputStyle: {
        ...theme.styles.textNormal,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: theme.colors.black,
        minHeight: 35,
        maxHeight: 200,
        lineHeight: 20.5,
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 7,
      },
      placeholderTextColor: theme.colors.textPlaceholder,
      sendButton: {
        marginLeft: 10,
      },
      tabBarHeight: extra.tabBarHeight,
    },
    date: {
      text: {
        ...theme.styles.textTiny,
        color: theme.colors.textLight,
      },
    },
    icons: {
      attachmentButtonIcon: () => {
        return React.createElement(Icon, {
          name: 'paperclip',
          type: 'material-community',
          color: theme.colors.brandSecondary,
          size: 32,
        });
      },
      sendButtonIcon: () => {
        return React.createElement(Icon, {
          name: 'send-circle',
          type: 'material-community',
          color: theme.colors.brandSecondary,
          size: 38,
          style: {
            marginRight: 5,
            transform: [{ rotateZ: '-45deg' }],
          },
        });
      },
    },
    list: {
      activityIndicator: {
        color: theme.colors.brandPrimary,
      },
      container: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: 12,
      },
      contentContainer: {
        backgroundColor: theme.colors.white,
      },
    },
    statusIcon: {
      activityIndicator: {
        color: theme.colors.brandPrimary,
      },
      image: {
        tintColor: theme.colors.brandPrimary,
      },
      imageError: {
        tintColor: theme.colors.assertive,
      },
    },
    typingIndicator: {
      dotColor: theme.colors.blackTransparentLight,
    },
  });
};
