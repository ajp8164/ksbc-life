import { Theme, defaultTheme } from '@flyerhq/react-native-chat-ui';
import { fontFamily, fontSizes } from '@react-native-ajp-elements/ui';

import { AppTheme } from 'theme';
import { Icon } from '@rneui/base';
import React from 'react';
import lodash from 'lodash';

export const chatTheme = (
  theme: AppTheme,
  extra: { tabBarHeight: number },
): Theme => {
  return lodash.merge({}, defaultTheme, {
    avatar: {
      text: {
        color: theme.colors.stickyWhite,
        fontSize: fontSizes.normal,
        fontFamily,
        fontWeight: 'normal',
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
      attachmentPlaceholderIcon: {
        tintColor: theme.colors.stickyWhite,
      },
      contentOffsetKeyboardClosed: -25, // This values should be adjusted if the design height of the composer changes.
      contentOffsetKeyboardOpened: 84, // This values should be adjusted if the design height of the composer changes.
      container: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      fileAttachmentPlaceholderContainer: {
        backgroundColor: theme.colors.subtleGray,
        borderColor: theme.colors.lightGray,
      },
      fileAttachmentPlaceholderIconContainer: {
        backgroundColor: theme.colors.lightGray,
      },
      fileAttachmentPlaceholderText: {
        ...theme.styles.textNormal,
      },
      inputAttachmentDivider: {
        borderTopColor: theme.colors.subtleGray,
        borderTopWidth: 1,
      },
      inputContainer: {
        borderWidth: 1,
        borderRadius: 20,
      },
      inputStyle: {
        ...theme.styles.textNormal,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
        minHeight: 35,
        maxHeight: 200,
        lineHeight: 20.5,
        paddingTop: 5,
        paddingBottom: 5,
        top: 2,
      },
      placeholderTextColor: theme.colors.textPlaceholder,
      removeAttachmentButton: {
        backgroundColor: theme.colors.darkGray,
        borderColor: theme.colors.stickyWhite,
        tintColor: theme.colors.stickyWhite,
      },
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
          style: { marginRight: 10 },
        });
      },
      sendButtonIcon: () => {
        return React.createElement(Icon, {
          name: 'send-circle',
          type: 'material-community',
          color: theme.colors.brandSecondary,
          size: 38,
          style: {
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
