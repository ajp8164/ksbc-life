import { UserProfile } from 'types/user';
import { isEmulator } from 'react-native-device-info';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { updateUser } from 'firebase/firestore';

export type PushNotificationToken = {
  fcm: string;
  apns: string | null;
};

export type MessagingTopic = 'all-installs' | 'all-users';

export const initPushNotifications = () => {
  messaging()
    .requestPermission()
    .then(async permission => {
      // Need to fetch token before subscribing to topic.
      const token = await getDeviceToken();
      subscribeToTopic('all-installs');

      log.debug(`Push notifications permission: ${permission}`);
      log.debug(`Push notifications token: ${JSON.stringify(token)}`);
    });
};

export const subscribeToTopic = (name: MessagingTopic) => {
  messaging().subscribeToTopic(name);
};

export const unsubscribeFromTopic = (name: MessagingTopic) => {
  messaging().unsubscribeFromTopic(name);
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
  return { fcm, apns };
};

export const hasPushNotificationsPermission = async () => {
  const authStatus = await messaging().hasPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
};

export const setupPushNotificationsForUser = async (
  userProfile: UserProfile,
): Promise<UserProfile> => {
  // Add push token to the authorized user profile.
  const token = await getDeviceToken();

  const updatedProfile = Object.assign({}, userProfile);
  if (token) {
    updatedProfile.notifications.pushTokens = lodash.uniq(
      updatedProfile.notifications.pushTokens.concat(token?.fcm),
    );
    updateUser(updatedProfile);
  }
  subscribeToTopic('all-users');

  // Restore badge count to app icon. Signing in from a signed out state
  // reapplys the badge count. If already signed in then the badge count is
  // simply reasserted.
  notifee.setBadgeCount(userProfile.notifications.badgeCount);

  return updatedProfile;
};

export const removePushNotificationsFromUser = async (
  userProfile?: UserProfile,
): Promise<void> => {
  // Remove push token from the authorized user profile.
  // Remove only the token for this device.
  if (userProfile) {
    const { fcm } = await getDeviceToken();
    const updatedProfile = Object.assign({}, userProfile);
    updatedProfile.notifications.pushTokens = lodash.filter(
      userProfile.notifications.pushTokens,
      t => {
        return t !== fcm;
      },
    );
    await updateUser(updatedProfile);
  }
  unsubscribeFromTopic('all-users');

  // Remove app icon badge count.
  notifee.setBadgeCount(0);
};
