import { isEmulator } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

export type PushNotificationToken = {
  fcm: string;
  apns: string | null;
};

export type MessagingTopic = 'all-installs' | 'all-users';

export const requestPushNotificationPermission =
  async (): Promise<PushNotificationToken | null> => {
    return messaging()
      .requestPermission()
      .then(() => {
        return checkPermissionGetToken();
      })
      .catch(() => {
        // User has rejected permission
        return null;
      });
  };

export const subscribeToTopic = (name: MessagingTopic) => {
  messaging().subscribeToTopic(name);
};

export const unsubscribeFromTopic = (name: MessagingTopic) => {
  messaging().unsubscribeFromTopic(name);
};

const checkPermissionGetToken =
  async (): Promise<PushNotificationToken | null> => {
    const status = await messaging().hasPermission();
    if (status === messaging.AuthorizationStatus.AUTHORIZED) {
      return await getDeviceToken();
    } else if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
      return await requestPushNotificationPermission();
    } else {
      return null;
    }
  };

const getDeviceToken = async (): Promise<PushNotificationToken> => {
  if (await isEmulator()) {
    // Running on the iOS simulator will produce an error. Setting a bogus value here avoids the error.
    // See https://github.com/invertase/react-native-firebase/issues/6893
    await messaging().setAPNSToken('bogus');
  }

  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }

  const fcm = await messaging().getToken();
  const apns = await messaging().getAPNSToken();
  const token = { fcm, apns };
  return token;
};
