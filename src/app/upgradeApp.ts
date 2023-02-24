import { AppError } from 'lib/errors';
import { log } from '@react-native-ajp-elements/core';
import { upgradeStorage } from './upgradeStorage';

export const upgradeApp = (): void => {
  try {
    upgradeStorage();
    log.info(`App upgrade check ok`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`App upgrade: ${e.message}`);
    if (e instanceof AppError) throw e;
    throw new AppError(e.message);
  }
};
