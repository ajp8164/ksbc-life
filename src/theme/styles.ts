import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';
import { viewport } from '@react-native-ajp-elements/ui';

export const useStyles = makeStyles(
  (theme): Styles => ({
    example: {
      color: theme.colors.assertive,
    },
    // Aligns items in viewport.width without using view padding (which clips shadows).
    viewWidth: {
      width: viewport.width - 2 * 20, // Left/right padding in views is 20
      alignSelf: 'center',
    },
  }),
);
