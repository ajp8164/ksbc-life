import 'react-native-gesture-handler'; // Must be at top, see https://reactnavigation.org/docs/en/getting-started.html

import { persistor, store } from 'store';

import AppMain from 'components/AppMain';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import { theme } from 'theme';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  "The provided value 'moz",
  "The provided value 'ms-stream",
]);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppMain />
            </PersistGate>
          </ReduxProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
