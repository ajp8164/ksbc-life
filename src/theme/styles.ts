import {
  fontSizes as defaultFontSizes,
  fontFamily,
} from '@react-native-ajp-elements/ui';

import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';

export const fontSizes = {
  ...defaultFontSizes,
  giant: 54,
  micro: 10,
};

export const useStyles = makeStyles(
  (theme): Styles => ({
    avatarGiant: {
      width: 100,
      height: 100,
      borderRadius: 100,
      overflow: 'hidden',
    },
    avatarLarge: {
      width: 55,
      height: 55,
      borderRadius: 55,
      overflow: 'hidden',
    },
    avatarMedium: {
      width: 42,
      height: 42,
      borderRadius: 42,
      overflow: 'hidden',
    },
    avatarSmall: {
      width: 30,
      height: 30,
      borderRadius: 30,
      overflow: 'hidden',
    },
    avatarTitleGiant: {
      color: theme.colors.stickyWhite,
      fontSize: fontSizes.giant,
      fontFamily,
      fontWeight: 'normal',
    },
    avatarTitleLarge: {
      color: theme.colors.stickyWhite,
      fontSize: fontSizes.xl,
      fontFamily,
      fontWeight: 'normal',
    },
    avatarTitleMedium: {
      color: theme.colors.stickyWhite,
      fontSize: fontSizes.large,
      fontFamily,
      fontWeight: 'normal',
    },
    avatarTitleSmall: {
      color: theme.colors.stickyWhite,
      fontSize: fontSizes.normal,
      fontFamily,
      fontWeight: 'normal',
    },
    navigationBarTitle: {
      color: theme.colors.black,
      fontSize: fontSizes.heading5,
      fontFamily,
      // fontWeight: 'normal',
    },

    /**
     * Content Styles
     * NOTE -- These style *names* are stored in firestore. Changing the names will break rendered layout.
     */

    pageContentCardDefaultStyle: {
      marginBottom: 25,
      paddingVertical: 0,
      overflow: 'hidden',
    },
    pageContentCardTransparentStyle: {
      marginBottom: 25,
      backgroundColor: theme.colors.transparent,
    },
    pageContentCardTitleStyle: {
      textAlign: 'left',
    },
    pageContentCardHeaderStyle: {},
    pageContentCardFooterStyle: {},
    pageContentCardBodyStyle: {},

    /**
     * Styles
     */

    textGiant: {
      color: theme.colors.text,
      fontSize: fontSizes.giant,
      fontFamily,
      fontWeight: 'normal',
    },
    textMicro: {
      color: theme.colors.text,
      fontSize: fontSizes.micro,
      fontFamily,
      fontWeight: 'normal',
    },

    // Aligns items in viewport.width without using view padding (which clips shadows).
    viewHorizontalInset: {
      paddingHorizontal: 15,
    },
  }),
);
