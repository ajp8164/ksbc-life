import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useEffect, useRef } from 'react';
import { useAuthorizeUser, useUnauthorizeUser } from '.';

import { Alert } from 'react-native';
import { DateTime } from 'luxon';
import { SignInModalMethods } from 'components/modals/SignInModal';
import { appConfig } from 'config';
import lodash from 'lodash';
import { selectUser } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

type AuthContext = {
  dismissSignInModal: () => void;
  presentSignInModal: (msg?: string) => void;
  userIsAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContext>({
  userIsAuthenticated: false,
  dismissSignInModal: () => {
    return;
  },
  presentSignInModal: () => {
    return;
  },
});

export const useAuthContext = (
  signInModalRef: React.RefObject<SignInModalMethods>,
): AuthContext => {
  const authorizeUser = useAuthorizeUser();
  const authorizeUserDebounced = useRef(lodash.debounce(authorizeUser, 200));
  const unauthorizeUser = useUnauthorizeUser();
  const unauthorizeUserDebounced = useRef(
    lodash.debounce(unauthorizeUser, 200),
  );
  const user = useSelector(selectUser);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(credentials => {
      // This handler is called multiple times. Avoid more than one authoization.
      // See https://stackoverflow.com/a/40436769
      if (isReAuthenticationRequired(user.credentials)) {
        unauthorizeUserDebounced.current();
        return present(
          'You have been signed out.\nPlease sign in again to keep using all features.',
        );
      }

      authorizeUserDebounced.current(credentials, {
        onError: onAuthError,
        onAuthorized: () => {
          dismiss();
        },
      });
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    signInModalRef.current?.dismiss();
  };

  const present = (msg?: string) => {
    signInModalRef.current?.present(msg);
  };

  const onAuthError = () => {
    Alert.alert(
      'Sign In Failed',
      'There was a problem signing in. Please try again.',
      [{ text: 'OK' }],
      { cancelable: false },
    );
  };

  return {
    dismissSignInModal: dismiss,
    presentSignInModal: present,
    userIsAuthenticated: !lodash.isEmpty(user.credentials),
  };
};

const isReAuthenticationRequired = (
  credentials?: FirebaseAuthTypes.User | null,
) => {
  const lastSignInTime = credentials?.metadata.lastSignInTime;
  if (appConfig.requireReAuthDays > 0 && lastSignInTime) {
    const daysSinceLastSignIn = DateTime.fromISO(lastSignInTime)
      .diffNow()
      .shiftTo('days')
      .toObject().days;
    if (
      daysSinceLastSignIn &&
      Math.abs(daysSinceLastSignIn) < appConfig.requireReAuthDays
    ) {
      return true;
    }
  }
  return false;
};
