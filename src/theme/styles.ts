import { Platform } from 'react-native';
import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';

export const useStyles = makeStyles(
  (_theme): Styles => ({
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
    // Styles
    pageContentCardStyle: {
      paddingVertical: 0,
    },
    pageContentCardTitleStyle: {
      textAlign: 'left',
    },
    // Aligns items in viewport.width without using view padding (which clips shadows).
    viewHorizontalInset: {
      paddingHorizontal: 15,
    },
  }),
);
