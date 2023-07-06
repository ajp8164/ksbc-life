import { UserProfile } from 'types/user';
import { isEmulator } from 'react-native-device-info';
import lodash from 'lodash';
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

export const enablePushNotifications = async (
  userProfile: UserProfile,
): Promise<UserProfile> => {
  // Add push token to the authorized user profile.
  const token = await requestPushNotificationPermission();

  const updatedProfile = Object.assign({}, userProfile);
  if (token) {
    updatedProfile.notifications.pushTokens = lodash.uniq(
      updatedProfile.notifications.pushTokens.concat(token?.fcm),
    );
    updateUser(updatedProfile);
  }
  subscribeToTopic('all-users');

  return updatedProfile;
};

export const disablePushNotifications = async (
  userProfile?: UserProfile,
): Promise<void> => {
  // Remove push token from the authorized user profile.
  if (userProfile) {
    const updatedProfile = Object.assign({}, userProfile);
    updatedProfile.notifications.pushTokens = [];
    await updateUser(updatedProfile);
  }
  unsubscribeFromTopic('all-users');
};
