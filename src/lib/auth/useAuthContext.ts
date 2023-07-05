import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useEffect, useRef } from 'react';

import { Alert } from 'react-native';
import { DateTime } from 'luxon';
import { SignInModalMethods } from 'components/modals/SignInModal';
import { UserProfile } from 'types/user';
import { appConfig } from 'config';
import lodash from 'lodash';
import { selectUser } from 'store/selectors/userSelectors';
import { useAuthorizeUser } from '.';
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
  const user = useSelector(selectUser);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(credentials => {
      // This handler is called multiple times. Avoid more than one authorization.
      // See https://stackoverflow.com/a/40436769
      if (isReAuthenticationRequired(user.credentials)) {
        return present(
          'You have been signed out.\nPlease sign in again to keep using all features.',
        );
      }

      authorizeUserDebounced.current(credentials, {
        onError: onAuthError,
        onAuthorized,
        onUnauthorized,
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

  const onAuthError = (msg: string) => {
    if (msg.includes('firestore/unavailable')) {
      Alert.alert(
        'Service Unavailable',
        "We can't connect to the server. Please check your network connection and try again.",
        [{ text: 'OK' }],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'Sign In Failed',
        'There was a problem signing in. Please try again.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
  };

  const onAuthorized = (_userProfile: UserProfile) => {
    dismiss();
  };

  const onUnauthorized = (accountNotActive?: boolean) => {
    dismiss();
    if (accountNotActive) {
      Alert.alert(
        'Account Disabled',
        'Contact your administrator for more information.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
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
