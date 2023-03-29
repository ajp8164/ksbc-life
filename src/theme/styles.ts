import { Platform } from 'react-native';
import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';

export const useStyles = makeStyles(
  (theme): Styles => ({
    // Constants
    iosLargeHeader: {
      ...Platform.select({
        android: {
          height: 0,
        },
        ios: {
          height: 52,
        },
      }),
    },
    modalHeader: {
      height: 81,
    },

    // Content Styles
    // NOTE -- These style *names* are stored in firestore. Changing the names will break rendered layout.
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

    // Styles
    // Aligns items in viewport.width without using view padding (which clips shadows).
    viewHorizontalInset: {
      paddingHorizontal: 15,
    },
  }),
);
