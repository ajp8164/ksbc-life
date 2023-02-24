import { AppError } from 'lib/errors';
import { StoreState } from 'store/initialStoreState';
import { appConfig } from 'config';
import { dispatch } from 'store';
import { log } from '@react-native-ajp-elements/core';
import { saveSchemaVersion } from 'store/slices/app';
import { store } from 'store';

export const upgradeStorage = (): void => {
  const state: StoreState = store.getState();
  const fromVersion = state.app.storageSchemaVersion;
  const toVersion = appConfig.storageSchemaVersion;

  if (toVersion === 0) {
    throw new AppError('App config error, no storage schema specified');
  }

  // Run upgraders in order.
  for (let i = fromVersion; i < toVersion; i++) {
    upgraders[i]();
  }
};

const upgradeTo1 = (): void => {
  dispatch(saveSchemaVersion({ version: 1 }));
  log.info(`Storage schema v1 check ok`);
};

const upgraders = [upgradeTo1];
