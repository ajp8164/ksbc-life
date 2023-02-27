import { appleAuth } from '@invertase/react-native-apple-authentication';
import { NativeModules } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { log } from '@react-native-ajp-elements/core';

const { RNTwitterSignIn } = NativeModules;

export const signInWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    return auth().signInWithCredential(appleCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Sign in error: ${e.message}`);
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
      throw 'User canceled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return auth().signInWithCredential(facebookCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Sign in error: ${e.message}`);
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
      log.error(`Sign in error: ${e.message}`);
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
    return auth().signInWithCredential(twitterCredential);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('canceled')) {
      log.error(`Sign in error: ${e.message}`);
    }
  }
};

export const signOut = async () => {
  try {
    return await auth().signOut();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (!e.message.includes('auth/no-current-user')) {
      log.error(`Sign out error: ${e.message}`);
    }
  }
};
