import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { InitStatus, initApp } from 'app';
import { MainNavigatorParamList, StartupScreen } from 'types/navigation';
import { useEffect, useState } from 'react';

import { AppError } from 'lib/errors';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ColorModeSwitch } from '@react-native-ajp-elements/ui';
import ErrorBoundary from 'react-native-error-boundary';
import { LinkingOptions } from '@react-navigation/native';
import MainNavigator from 'components/navigation/MainNavigator';
import RNBootSplash from 'react-native-bootsplash';
import { StatusBar } from 'react-native';
import { log } from '@react-native-ajp-elements/core';
import { selectThemeSettings } from 'store/selectors/appSettingsSelectors';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

// See https://reactnavigation.org/docs/configuring-links
const linking: LinkingOptions<MainNavigatorParamList> = {
  prefixes: ['ksbc://', 'https://kingspring.org'],
  config: {
    screens: {},
  },
};

const AppMain = () => {
  const themeSettings = useSelector(selectThemeSettings);
  const scheme = useColorScheme();

  const [startupScreen, setStartupScreen] = useState<StartupScreen>(
    StartupScreen.None,
  );
  const [fatal, setFatal] = useState<string | undefined>(undefined);

  useEffect(() => {
    const hideSplashScreen = () => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          RNBootSplash.hide({ fade: true });
          StatusBar.setHidden(false);
          resolve();
        }, 200);
      });
    };

    (async () => {
      try {
        // Main application initialization.
        const status = await initApp();
        log.info(`Initialization status: ${status}`);

        switch (status) {
          case InitStatus.Success:
          case InitStatus.NotAuthorized:
            // The destination should handle condition NotAuthorized.
            setStartupScreen(StartupScreen.Home);
            break;
          case InitStatus.NoKey:
          case InitStatus.NotVerified:
          default:
            setStartupScreen(StartupScreen.Welcome);
        }

        hideSplashScreen();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        log.error(e.message);
        // Expose any initialization error.
        setFatal(e.message);
        hideSplashScreen();
      }
    })();
  }, []);

  if (fatal) {
    throw new AppError(fatal);
  }

  const onError = (error: Error, stack: string) => {
    log.fatal(`Unhandled app error: ${error.message}\n${stack}`);
  };

  return (
    <NavigationContainer
      linking={linking}
      // Removes default background (white) flash on tab change when in dark mode.
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BottomSheetModalProvider>
        <ColorModeSwitch themeSettings={themeSettings}>
          <ErrorBoundary onError={onError}>
            <MainNavigator startupScreen={startupScreen} />
          </ErrorBoundary>
        </ColorModeSwitch>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

export default AppMain;
