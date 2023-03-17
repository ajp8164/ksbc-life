import { Platform } from 'react-native';
import { createTheme } from '@rneui/themed';
import lodash from 'lodash';
import { theme as rneulTheme } from '@react-native-ajp-elements/ui';

export const theme = createTheme(
  lodash.merge({}, rneulTheme, {
    darkColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      cardBackground: '#202020',
      listItemBackgroundAlt: '#101010',
      shadowColor: '#00000000',
      ...Platform.select({
        ios: {
          screenHeaderBackButton: '#80BFE1',
        },
      }),
    },
    lightColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      cardBackground: '#FFFFFF',
      listItemBackgroundAlt: '#f7f7f7',
      shadowColor: '#000000',
      ...Platform.select({
        ios: {
          screenHeaderBackButton: '#80BFE1',
        },
      }),
    },
  }),
);
