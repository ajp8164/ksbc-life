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
