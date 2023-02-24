import { biometricAuthentication as RNXEBiometricAuthentication } from '@react-native-ajp-elements/core';
import { store } from 'store';

export const biometricAuthentication = async (): Promise<void> => {
  if (store.getState().appSettings.biometrics) {
    return RNXEBiometricAuthentication();
  }
};
