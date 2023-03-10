import { Alert, StatusBar } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { InitStatus, initApp } from 'app';
import { MainNavigatorParamList, StartupScreen } from 'types/navigation';
import { createContext, useEffect, useRef, useState } from 'react';

import { AppError } from 'lib/errors';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ColorModeSwitch } from '@react-native-ajp-elements/ui';
import ErrorBoundary from 'react-native-error-boundary';
import { LinkingOptions } from '@react-navigation/native';
import MainNavigator from 'components/navigation/MainNavigator';
import RNBootSplash from 'react-native-bootsplash';
import { SignInModal } from 'components/modals/SignInModal';
import auth from '@react-native-firebase/auth';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import { selectThemeSettings } from 'store/selectors/appSettingsSelectors';
import { useAuthorizeUser } from 'lib/auth';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

// See https://reactnavigation.org/docs/configuring-links
const linking: LinkingOptions<MainNavigatorParamList> = {
  prefixes: ['ksbc://', 'https://kingspring.org'],
  config: {
    screens: {},
  },
};

type SignInContext = {
  isPresented: boolean;
  dismiss: () => void;
  present: () => void;
};

export const SignInContext = createContext<SignInContext>({
  isPresented: false,
  dismiss: () => {
    return;
  },
  present: () => {
    return;
  },
});

const AppMain = () => {
  const themeSettings = useSelector(selectThemeSettings);
  const scheme = useColorScheme();

  const signInModalRef = useRef<SignInModal>(null);
  const signInModalPresentedRef = useRef(false);
  const authorizeUser = useAuthorizeUser();
  const authorizeUserDebounced = useRef(lodash.debounce(authorizeUser, 200));

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

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(credentials => {
      console.log('HERE', signInModalPresentedRef.current);
      // This handler is called multiple times.
      // See https://stackoverflow.com/a/40436769
      if (signInModalPresentedRef.current) {
        authorizeUserDebounced.current(credentials, {
          onError: onAuthError,
          onAuthorized: () => {
            dismissSignInModal();
          },
        });
      }
    });
    return unsubscribe;
  }, []);

  const dismissSignInModal = () => {
    signInModalRef.current?.dismiss();
    signInModalPresentedRef.current = false;
    console.log('DISMISSED');
  };

  const presentSignInModal = () => {
    signInModalRef.current?.present();
    signInModalPresentedRef.current = true;
    console.log('PRESENTED');
  };

  const onAuthError = () => {
    Alert.alert(
      'Sign In Failed',
      'There was a problem signing in. Please try again.',
      [{ text: 'OK' }],
      { cancelable: false },
    );
  };

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
            <SignInContext.Provider
              value={{
                isPresented: signInModalPresentedRef.current,
                dismiss: dismissSignInModal,
                present: presentSignInModal,
              }}>
              <MainNavigator startupScreen={startupScreen} />
              <SignInModal ref={signInModalRef} />
            </SignInContext.Provider>
          </ErrorBoundary>
        </ColorModeSwitch>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

export default AppMain;
