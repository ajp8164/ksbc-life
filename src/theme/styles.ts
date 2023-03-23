import { Platform } from 'react-native';
import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';
import { viewport } from '@react-native-ajp-elements/ui';

export const useStyles = makeStyles(
  (_theme): Styles => ({
    // Constants
    bottomSheetHandle: {
      height: 24,
    },
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
    topTabBar: {
      height: 48,
    },
    //
    // Aligns items in viewport.width without using view padding (which clips shadows).
    viewWidth: {
      width: viewport.width - 2 * 20, // Left/right padding in views is 20
      alignSelf: 'center',
    },
  }),
);
