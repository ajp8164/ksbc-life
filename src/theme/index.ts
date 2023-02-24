import { Colors, Theme, useTheme as useRNETheme } from '@rneui/themed';
import {
  Styles as RNEULStyles,
  useStyles as useRNEULStyles,
} from '@react-native-ajp-elements/ui';

import { Styles } from './types/Styles';
import { useStyles } from './styles';

export { theme } from './theme';

export * from './svg';

export const useTheme = () => {
  const { theme, updateTheme } = useRNETheme();
  const rneulStyles = useRNEULStyles();
  const styles = useStyles();
  return {
    ...theme,
    styles: {
      ...rneulStyles,
      ...styles,
    },
    updateTheme,
  };
};

export interface AppTheme extends Theme {
  colors: Colors;
  styles: RNEULStyles & Styles;
}
