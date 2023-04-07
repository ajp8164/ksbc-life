import { StyleSheet } from 'react-native';
import { Theme } from '../../types';

export default ({ theme }: { theme: Theme }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...theme.list.container,
    },
    emptyComponentContainer: {
      alignItems: 'center',
      marginHorizontal: 24,
      transform: [{ rotateX: '180deg' }],
    },
    emptyComponentTitle: {
      ...theme.list.emptyChatPlaceholderText,
    },
    flatList: {
      flex: 1,
      ...theme.list.container,
    },
    flatListContentContainer: {
      flexGrow: 1,
      ...theme.list.contentContainer,
    },
    footer: {
      height: 16,
    },
    footerLoadingPage: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      height: 32,
    },
    header: {
      height: 4,
    },
  });