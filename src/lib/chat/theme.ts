import { AppTheme } from 'theme';
import { Theme } from '@flyerhq/react-native-chat-ui';

export const chatTheme = (
  theme: AppTheme,
  extra: { tabBarHeight: number },
): Theme => {
  return {
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
        backgroundColor: theme.colors.brandSecondary,
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
      headerText: {
        ...theme.styles.textTiny,
      },
      textLeftContainer: {
        marginHorizontal: 15,
        marginVertical: 8,
      },
      textRightContainer: {
        marginHorizontal: 15,
        marginVertical: 8,
      },
    },
    colors: {},
    composer: {
      activityIndicator: {
        color: theme.colors.brandPrimary,
      },
      attachmentIcon: {
        tintColor: theme.colors.brandPrimary,
      },
      contentOffsetKeyboardOpened: 11,
      container: {
        backgroundColor: theme.colors.subtleGray,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingVertical: 10,
      },
      inputStyle: {
        ...theme.styles.textNormal,
        backgroundColor: theme.colors.white,
        color: theme.colors.text,
        borderRadius: 5,
      },
      sendIcon: {
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
      activityIndicator: {
        color: theme.colors.brandPrimary,
      },
      container: {
        backgroundColor: theme.colors.white,
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
  };
};
