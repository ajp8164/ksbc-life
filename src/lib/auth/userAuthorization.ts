import { UserProfile, UserRole, UserStatus } from 'types/user';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import { saveUser } from 'store/slices/user';
import { signOut } from 'lib/auth';
import { useDispatch } from 'react-redux';

export const useAuthorizeUser = () => {
  const setUser = useSetUser();
  const unauthorizeUser = useUnauthorizeUser();

  return (
    credentials: FirebaseAuthTypes.User | null,
    result?: {
      onAuthorized?: () => void;
      onUnauthorized?: (alertUser?: boolean) => void;
      onError?: (msg: string) => void;
    },
  ) => {
    console.log(credentials);
    if (credentials) {
      // Check if user already exists in firstore. If not then add the user to firestore.
      firestore()
        .collection('Users')
        .doc(credentials.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            // Add user to firestore and set user.
            const profile = createProfile(credentials);

            firestore()
              .collection('Users')
              .doc(credentials.uid)
              .set(profile)
              .then(() => {
                log.debug(`User profile created: ${JSON.stringify(profile)}`);
                const user = setUser(credentials, profile);
                result?.onAuthorized && result.onAuthorized();
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
                photoUrl: credentials?.photoURL,
              }) as UserProfile;

              if (!lodash.isEqual(updatedProfile, profile)) {
                firestore()
                  .collection('Users')
                  .doc(credentials.uid)
                  .update({
                    photoUrl: credentials?.photoURL,
                  })
                  .then(() => {
                    log.debug(
                      `User profile updated: ${JSON.stringify(updatedProfile)}`,
                    );
                    const user = setUser(credentials, updatedProfile);
                    result?.onAuthorized && result.onAuthorized();
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
                result?.onAuthorized && result.onAuthorized();
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

const createProfile = (credentials: FirebaseAuthTypes.User): UserProfile => {
  return {
    name: credentials.displayName,
    email: credentials.email,
    photoUrl: credentials.photoURL,
    role: credentials.isAnonymous ? UserRole.Anonymous : UserRole.User,
    status: UserStatus.Active,
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
