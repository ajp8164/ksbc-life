import { UserProfile, UserRole } from 'types/user';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useEffect, useRef } from 'react';
import { signInAnonymously, useAuthorizeUser, useUnauthorizeUser } from '.';

import { Alert } from 'react-native';
import { DateTime } from 'luxon';
import { SignInModalMethods } from 'components/modals/SignInModal';
import { StoreState } from 'store/initialStoreState';
import { appConfig } from 'config';
import { cacheUsers } from 'firebase/firestore/cache';
import { deleteUser } from 'firebase/firestore/users';
import lodash from 'lodash';
import { selectUser } from 'store/selectors/userSelectors';
import { store } from 'store';
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
      if (credentials) {
        deleteCurrentProfileIfAnonymous();
      }

      // This handler is called multiple times. Avoid more than one authorization.
      // See https://stackoverflow.com/a/40436769
      if (isReAuthenticationRequired(user.credentials)) {
        unauthorizeUserDebounced.current();
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

  const onAuthorized = (userProfile: UserProfile) => {
    dismiss();

    if (userProfile.role !== UserRole.Anonymous) {
      // Cache data from firestore.
      cacheUsers();
    }
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

    // Not authorized via sign-on credentials. Provide anonymous authentication.
    // Anonymous sign in allows restricted use of firebase services.
    signInAnonymously();
  };

  return {
    dismissSignInModal: dismiss,
    presentSignInModal: present,
    userIsAuthenticated: !lodash.isEmpty(user.credentials),
  };
};

const deleteCurrentProfileIfAnonymous = () => {
  // Delete the anonymous user profile.
  const state: StoreState = store.getState();
  const currentProfile = state.user.profile;

  if (currentProfile?.role === UserRole.Anonymous && currentProfile.id) {
    deleteUser(currentProfile.id);
  }
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
