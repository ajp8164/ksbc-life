import { createContext, useEffect, useRef } from 'react';

import { Alert } from 'react-native';
import { SignInModalMethods } from 'components/modals/SignInModal';
import auth from '@react-native-firebase/auth';
import lodash from 'lodash';
import { selectUser } from 'store/selectors/userSelectors';
import { useAuthorizeUser } from 'lib/auth';
import { useSelector } from 'react-redux';

type AuthContext = {
  dismissSignInModal: () => void;
  presentSignInModal: () => void;
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
      // This handler is called multiple times.
      // See https://stackoverflow.com/a/40436769
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

  const present = () => {
    signInModalRef.current?.present();
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
