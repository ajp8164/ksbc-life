import { Colors, Theme, useTheme as useRNETheme } from '@rneui/themed';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  return {
    ...theme,
    styles: {
      ...rneulStyles,
      ...styles,
    },
    insets,
    updateTheme,
  };
};

export interface AppTheme extends Theme {
  colors: Colors;
  insets: EdgeInsets;
  styles: RNEULStyles & Styles;
}
