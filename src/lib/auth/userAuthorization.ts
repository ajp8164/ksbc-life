import { UserProfile, UserRole, UserStatus } from 'types/user';
import { addUser, getUser, updateUser } from 'firebase/firestore';
import { getUserAvatarColor, getUserInitials } from 'lib/user';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import { saveUser } from 'store/slices/user';
import { signOut } from 'lib/auth';
import { unsubscribeFromTopic } from 'lib/pushNotifications';
import { useDispatch } from 'react-redux';
import { useTheme } from 'theme';

export const useAuthorizeUser = () => {
  const setUser = useSetUser();
  const unauthorizeUser = useUnauthorizeUser();
  const theme = useTheme();

  return (
    credentials: FirebaseAuthTypes.User | null,
    result?: {
      onAuthorized?: (userProfile: UserProfile) => void;
      onUnauthorized?: (alertUser?: boolean) => void;
      onError?: (msg: string) => void;
    },
  ) => {
    if (credentials) {
      // Check if user already exists in firstore. If not then add the user to firestore.
      getUser(credentials.uid)
        .then(userProfile => {
          if (!userProfile) {
            // Add user to firestore and set user.
            const profile = createProfile(
              credentials,
              theme.colors.avatarColors,
            );

            addUser(profile)
              .then(() => {
                log.debug(`User profile created: ${JSON.stringify(profile)}`);
                const user = setUser(credentials, profile);
                result?.onAuthorized && result.onAuthorized(user.profile);
                log.debug(
                  `User sign in complete: ${JSON.stringify(user.profile)}`,
                );
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((e: any) => {
                log.error(`Failed to add user to firestore: ${e.message}`);
                result?.onError && result.onError(e.message);
              });
          } else {
            // User exists. Update user in firestore (if needed) and set user.
            if (userProfile.status === UserStatus.Active) {
              const updatedProfile = Object.assign({}, userProfile, {
                photoUrl:
                  credentials?.photoURL !== null ? credentials?.photoURL : '',
              }) as UserProfile;

              if (!lodash.isEqual(updatedProfile, userProfile)) {
                updateUser(updatedProfile)
                  .then(() => {
                    log.debug(
                      `User profile updated: ${JSON.stringify(updatedProfile)}`,
                    );
                    const user = setUser(credentials, updatedProfile);
                    result?.onAuthorized && result.onAuthorized(user.profile);
                    log.debug(
                      `User sign in complete: ${JSON.stringify(user.profile)}`,
                    );
                  })
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .catch((e: any) => {
                    log.error(`Failed to add user to firestore: ${e.message}`);
                    result?.onError && result.onError(e.message);
                  });
              } else {
                const user = setUser(credentials, userProfile);
                result?.onAuthorized && result.onAuthorized(user.profile);
                log.debug(
                  `User sign in complete: ${JSON.stringify(user.profile)}`,
                );
              }
            } else {
              // User is not allowed to sign in.
              signOut().then(() => {
                unauthorizeUser(userProfile);
                result?.onUnauthorized && result.onUnauthorized(true);
              });
            }
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          log.error(`Failed to authenticate credentialed user: ${e.message}`);
          result?.onError && result.onError(e.message);
        });
    } else {
      signOut().then(() => {
        unauthorizeUser();
        result?.onUnauthorized && result.onUnauthorized();
      });
    }
  };
};

const createProfile = (
  credentials: FirebaseAuthTypes.User,
  colors: string[],
): UserProfile => {
  const firstName = credentials.displayName?.split(' ')[0] || '';
  const lastName = credentials.displayName?.split(' ')[1] || '';
  return {
    id: credentials.uid,
    name: credentials.displayName || '',
    firstName,
    lastName,
    email: credentials.email,
    photoUrl: credentials.photoURL !== null ? credentials.photoURL : '',
    avatar: {
      color: getUserAvatarColor(`${firstName}${lastName}`, colors),
      title: getUserInitials(firstName || credentials.email || '', lastName),
    },
    role: UserRole.User,
    status: UserStatus.Active,
    groups: [],
    pushTokens: [],
  } as UserProfile;
};

const useSetUser = () => {
  const dispatch = useDispatch();
  return (credentials: FirebaseAuthTypes.User, profile: UserProfile) => {
    const user = {
      credentials: JSON.parse(JSON.stringify(credentials)), // Remove non-serializable properties (functions).
      profile: {
        ...profile,
        id: credentials.uid, // Store the user id locally.
      },
    };

    dispatch(saveUser({ user }));
    return user;
  };
};

export const useUnauthorizeUser = () => {
  const dispatch = useDispatch();
  return (userProfile?: UserProfile) => {
    // When a user is unauthorized (e.g. on sign out) remove the users push tokens.
    // This avoids sending notifications to a device that used to have the user signed
    // in but is no longer.
    if (userProfile) {
      const updatedProfile = Object.assign({}, userProfile);
      updatedProfile.pushTokens = [];
      updateUser(updatedProfile);
    }
    unsubscribeFromTopic('all-users');

    dispatch(
      saveUser({
        user: {
          credentials: undefined,
          profile: undefined,
        },
      }),
    );
    log.debug('User sign out complete');
  };
};
