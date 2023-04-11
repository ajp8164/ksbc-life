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
      justifyContent: 'center',
      transform: [{ rotateX: '180deg' }],
      height: '100%',
      width: '100%',
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
    headerIsTyping: {
      marginBottom: theme.bubble.containerLeft.marginLeft,
      marginLeft: theme.bubble.containerLeft.marginLeft,
      justifyContent: 'center',
    },
  });
