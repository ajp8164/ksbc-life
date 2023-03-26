import { Platform } from 'react-native';
import { createTheme } from '@rneui/themed';
import lodash from 'lodash';
import { theme as rneulTheme } from '@react-native-ajp-elements/ui';

export const theme = createTheme(
  lodash.merge({}, rneulTheme, {
    darkColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      calm: '#B260EA',
      cardBackground: '#202020',
      listItemBackgroundAlt: '#101010',
      shadowColor: '#00000000',

      ...Platform.select({
        ios: {
          screenHeaderBackButton: '#80BFE1',
          switchOffThumb: '#ffffff',
          switchOnThumb: '#ffffff',
          switchOffTrack: '#e5e5e5',
          switchOnTrack: '#80BFE1',
        },
        android: {
          switchOffThumb: '#787878',
          switchOnThumb: '#80BFE1',
          switchOffTrack: '#e5e5e5',
          switchOnTrack: '#80BFE140',
        },
      }),
    },
    lightColors: {
      brandPrimary: '#194E6A',
      brandSecondary: '#80BFE1',
      calm: '#B260EA',
      cardBackground: '#FFFFFF',
      listItemBackgroundAlt: '#f7f7f7',
      shadowColor: '#000000',

      ...Platform.select({
        ios: {
          screenHeaderBackButton: '#80BFE1',
          switchOffThumb: '#ffffff',
          switchOnThumb: '#ffffff',
          switchOffTrack: '#787878',
          switchOnTrack: '#80BFE1',
        },
        android: {
          switchOffThumb: '#cccccc',
          switchOnThumb: '#80BFE1',
          switchOffTrack: '#787878',
          switchOnTrack: '#80BFE140',
          screenHeaderBackButton: '#000000',
          screenHeaderInvBackButton: '#ffffff',
        },
      }),
    },
  }),
);
