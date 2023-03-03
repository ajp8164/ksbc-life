import { createTheme } from '@rneui/themed';
import lodash from 'lodash';
import { theme as rneulTheme } from '@react-native-ajp-elements/ui';

export const theme = createTheme(
  lodash.merge({}, rneulTheme, {
    darkColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      cardBackground: '#202020',
      shadowColor: '#00000000',
    },
    lightColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      cardBackground: '#FFFFFF',
      shadowColor: '#000000',
    },
  }),
);
