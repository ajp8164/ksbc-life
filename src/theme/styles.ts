import { Styles } from 'theme/types/Styles';
import { makeStyles } from '@rneui/themed';

export const useStyles = makeStyles(
  (theme): Styles => ({
    example: {
      color: theme.colors.assertive,
    },
  }),
);
