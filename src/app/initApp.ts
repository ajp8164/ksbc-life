import '@react-native-firebase/app';

import { AJPElements, log } from '@react-native-ajp-elements/core';

import { AppError } from 'lib/errors';
import { BackHandler } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appConfig } from 'config';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { svgImages } from 'theme';

export enum InitStatus {
  NotAuthorized = 'NotAuthorized',
  NotVerified = 'NotVerified',
  NoKey = 'NoKey',
  Success = 'Success',
}

export const initApp = async (): Promise<InitStatus> => {
  try {
    // Initialize firestore for dev as necessary.
    if (__DEV__) {
      firestore().useEmulator('localhost', 8080);
      storage().useEmulator('localhost', 9199);
      console.log('Firestore emulator running at localhost:8080');
    }

    // Disable Android hardware back button.
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    AJPElements.init({
      buildEnvironment: appConfig.buildEnvironment,
      sentryEndpoint: appConfig.sentryEndpoint,
      sentryLoggingEnabled: appConfig.sentryLoggingEnabled,
      svgImages,
      // userId: '',
    });

    GoogleSignin.configure({
      webClientId: appConfig.firebaseOauthClientId,
    });

    return InitStatus.Success;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`App initialization: ${e.message}`);
    throw new AppError(e.message);
  }
};
