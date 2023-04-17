import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeModules } from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { cancelAllFirestoreSubscriptions } from 'firebase/firestore/subscriptions';
import { log } from '@react-native-ajp-elements/core';

const { RNTwitterSignIn } = NativeModules;

export const signInAnonymously = async () => {
  try {
    return await auth().signInAnonymously();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`Anonymous sign in error: ${e.message}`);
    throw new Error(
      'An internal error occurred while trying to sign in. Please try again.',
    );
  }
};

export const signInWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // It appears putting FULL_NAME first is important
      // See https://github.com/invertase/react-native-apple-authentication/issues/293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('No identify token returned');
    }
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    const userCredential = await auth().signInWithCredential(appleCredential);
    const name = appleAuthRequestResponse.fullName;
    userCredential.user = {
      ...userCredential.user,
      displayName: `${name?.givenName} ${name?.familyName}`,
    };
    return userCredential;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // com.apple.AuthenticationServices.AuthorizationError is likely due to the user not being
    // signed into their iOS device via the Settings app or they auth'd with an incorrect
    // password.
    if (
      !e.message.includes('com.apple.AuthenticationServices.AuthorizationError')
    ) {
      log.error(`Apple sign in error: ${e.message}`);
      throw new Error(
        'An internal error occurred while trying to sign in. Please try again.',
      );
    }
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw new Error('User canceled the login process');
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return await auth().signInWithCredential(facebookCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Facebook sign in error: ${e.message}`);
      throw new Error(
        'An internal error occurred while trying to sign in. Please try again.',
      );
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Google sign in error: ${e.message}`);
      throw new Error(
        'An internal error occurred while trying to sign in. Please try again.',
      );
    }
  }
};

export const signInWithTwitter = async () => {
  try {
    const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();
    const twitterCredential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret,
    );
    return await auth().signInWithCredential(twitterCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Twitter sign in error: ${e.message}`);
      throw new Error(
        'An internal error occurred while trying to sign in. Please try again.',
      );
    }
  }
};

export const signInwithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  return await auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      // Success
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      if (e.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already in use.');
      }
      if (e.code === 'auth/invalid-email') {
        throw new Error('This email address is invalid.');
      }
      log.error(`Email/password sign in error: ${e.message}`);
      throw new Error(
        'An internal error occurred while trying to sign in. Please try again.',
      );
    });
};

export const signOut = async () => {
  try {
    // Cancel firestore data listener subscriptions before sign out.
    cancelAllFirestoreSubscriptions();

    LoginManager.logOut();
    await auth().signOut();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('auth/no-current-user')) {
      log.error(`Sign out error: ${e.message}`);
    }
  }
};

export const sendPasswordResetEmail = async (email: string) => {
  try {
    return await auth().sendPasswordResetEmail(email);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.message.includes('auth/user-not-found')) {
      throw new Error('There is no existing user for this email address.');
    }
    log.error(`Password reset error: ${e.message}`);
    throw new Error(
      'An internal error occurred while trying to send a reset password email. Please try again.',
    );
  }
};

export const createUserWithEmailAndPassword = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  try {
    return await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async user => {
        await user.user.updateProfile({
          displayName: `${firstName} ${lastName}`,
        });
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.message.includes('auth/email-already-exists')) {
      throw new Error(
        'The provided email is already in use by an existing user.',
      );
    }
    log.error(`Create account error: ${e.message}`);
    throw new Error(
      'An internal error occurred while creating your account. Please try again.',
    );
  }
};
