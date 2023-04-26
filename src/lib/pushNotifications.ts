import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import messaging from '@react-native-firebase/messaging';
import { updateUser } from 'firebase/firestore';

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

export const updatePushNotificationToken = async (userProfile: UserProfile) => {
  const updatedProfile = Object.assign({}, userProfile);
  const token = await checkPermissionGetToken();
  if (token) {
    updatedProfile.pushTokens = lodash.uniq(
      updatedProfile.pushTokens.concat(token?.fcm),
    );
    updateUser(updatedProfile);
  }
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
  const fcm = await messaging().getToken();
  const apns = await messaging().getAPNSToken();
  const token = { fcm, apns };
  log.debug(`Push notification token: ${JSON.stringify(token)}`);
  return token;
};
