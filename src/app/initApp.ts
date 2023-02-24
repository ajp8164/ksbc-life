import { AJPElements, log } from '@react-native-ajp-elements/core';
import { svgImages } from 'theme';

import { AppError } from 'lib/errors';
import { BackHandler } from 'react-native';
import { appConfig } from 'config';

export enum InitStatus {
  NotAuthorized = 'NotAuthorized',
  NotVerified = 'NotVerified',
  NoKey = 'NoKey',
  Success = 'Success',
}

export const initApp = async (): Promise<InitStatus> => {
  try {
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

    return InitStatus.Success;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`App initialization: ${e.message}`);
    throw new AppError(e.message);
  }
};
