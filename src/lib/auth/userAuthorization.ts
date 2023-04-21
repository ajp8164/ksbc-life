import { UserProfile, UserRole, UserStatus } from 'types/user';
import { getUserAvatarColor, getUserInitials } from 'lib/user';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import { saveUser } from 'store/slices/user';
import { signOut } from 'lib/auth';
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
      firestore()
        .collection('Users')
        .doc(credentials.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            // Add user to firestore and set user.
            const profile = createProfile(
              credentials,
              theme.colors.avatarColors,
            );

            firestore()
              .collection('Users')
              .doc(credentials.uid)
              .set(profile)
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
            const profile = documentSnapshot.data() as UserProfile;

            if (profile.status === UserStatus.Active) {
              const updatedProfile = Object.assign({}, profile, {
                photoUrl:
                  credentials?.photoURL !== null ? credentials?.photoURL : '',
              }) as UserProfile;

              if (!lodash.isEqual(updatedProfile, profile)) {
                firestore()
                  .collection('Users')
                  .doc(credentials.uid)
                  .update({
                    photoUrl: updatedProfile.photoUrl,
                  })
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
                const user = setUser(credentials, profile);
                result?.onAuthorized && result.onAuthorized(user.profile);
                log.debug(
                  `User sign in complete: ${JSON.stringify(user.profile)}`,
                );
              }
            } else {
              // User is not allowed to sign in.
              signOut().then(() => {
                unauthorizeUser();
                result?.onUnauthorized && result.onUnauthorized(true);
              });
            }
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          log.error(
            `Failed to query User collection from firestore: ${e.message}`,
          );
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
    name: credentials.displayName || '',
    firstName,
    lastName,
    email: credentials.email,
    photoUrl: credentials.photoURL !== null ? credentials.photoURL : '',
    avatar: {
      color: getUserAvatarColor(`${firstName}${lastName}`, colors),
      title: getUserInitials(firstName || credentials.email || '', lastName),
    },
    role: credentials.isAnonymous ? UserRole.Anonymous : UserRole.User,
    status: UserStatus.Active,
    groups: [],
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
  return () => {
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
