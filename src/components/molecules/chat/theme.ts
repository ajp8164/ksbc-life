import { Theme, defaultTheme } from '../../../react-native-chat-ui';

import { AppTheme } from 'theme';

export const chatTheme = (
  theme: AppTheme,
  extra: { tabBarHeight: number },
): Theme => {
  return {
    ...defaultTheme,
    avatar: {
      ...defaultTheme.avatar,
      text: {
        ...theme.styles.textSmall,
        ...theme.styles.textBold,
        color: theme.colors.textInv,
      },
    },
    bubble: {
      ...defaultTheme.bubble,
      contentLeftContainer: {
        ...defaultTheme.bubble.contentLeftContainer,
        backgroundColor: theme.colors.brandSecondary,
        borderRadius: 20,
      },
      contentRightContainer: {
        ...defaultTheme.bubble.contentRightContainer,
        backgroundColor: theme.colors.brandPrimary,
        borderRadius: 20,
      },
      messageTextLeft: {
        ...theme.styles.textNormal,
      },
      messageTextRight: {
        ...theme.styles.textNormal,
        color: theme.colors.textInv,
      },
      headerText: {
        ...defaultTheme.bubble.headerText,
        ...theme.styles.textTiny,
      },
      textLeftContainer: {
        ...defaultTheme.bubble.textLeftContainer,
        marginHorizontal: 15,
        marginVertical: 8,
      },
      textRightContainer: {
        ...defaultTheme.bubble.textRightContainer,
        marginHorizontal: 15,
        marginVertical: 8,
      },
    },
    colors: {
      ...defaultTheme.colors,
    },
    composer: {
      ...defaultTheme.composer,
      activityIndicator: {
        ...defaultTheme.composer.activityIndicator,
        color: theme.colors.brandPrimary,
      },
      attachmentIcon: {
        ...defaultTheme.composer.attachmentIcon,
        tintColor: theme.colors.brandPrimary,
      },
      contentOffsetKeyboardOpened: 11,
      container: {
        ...defaultTheme.composer.container,
        backgroundColor: theme.colors.subtleGray,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingVertical: 10,
      },
      inputStyle: {
        ...defaultTheme.composer.inputStyle,
        ...theme.styles.textNormal,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
        borderRadius: 5,
      },
      sendIcon: {
        ...defaultTheme.composer.attachmentIcon,
        tintColor: theme.colors.brandPrimary,
      },
      tabBarHeight: extra.tabBarHeight,
    },
    date: {
      text: {
        ...theme.styles.textTiny,
        ...theme.styles.textBold,
      },
    },
    list: {
      ...defaultTheme.list,
      activityIndicator: {
        ...defaultTheme.list.activityIndicator,
        color: theme.colors.brandPrimary,
      },
      container: {
        ...defaultTheme.list.container,
        backgroundColor: theme.colors.white,
      },
      contentContainer: {
        backgroundColor: theme.colors.white,
      },
    },
    statusIcon: {
      ...defaultTheme.statusIcon,
      activityIndicator: {
        ...defaultTheme.statusIcon.activityIndicator,
        color: theme.colors.brandPrimary,
      },
      image: {
        tintColor: theme.colors.brandPrimary,
      },
      imageError: {
        tintColor: theme.colors.assertive,
      },
    },
  };
};
