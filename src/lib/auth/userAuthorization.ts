import { UserProfile, UserRole } from 'types/user';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';
import { saveUser } from 'store/slices/user';
import { useDispatch } from 'react-redux';

export const useAuthorizeUser = () => {
  const setUser = useSetUser();
  const unauthorizeUser = useUnauthorizeUser();

  return (
    credentials: FirebaseAuthTypes.User | null,
    result?: {
      onAuthorized?: () => void;
      onUnauthorized?: () => void;
      onError?: () => void;
    },
  ) => {
    if (credentials) {
      // Check if user already exists in firstore. If not then add the user to firestore.
      firestore()
        .collection('Users')
        .doc(credentials.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.data()) {
            // Add user to firestore and set user.
            const profile = createProfile(credentials);

            firestore()
              .collection('Users')
              .doc(credentials.uid)
              .set(profile)
              .then(() => {
                log.debug(`User profile created: ${JSON.stringify(profile)}`);
                setUser(credentials, profile);
                result?.onAuthorized && result.onAuthorized();
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((e: any) => {
                log.error(`Failed to add user to firestore: ${e.message}`);
                result?.onError && result.onError();
              });
          } else {
            // User exists. Update user in firestore (if needed) and set user.
            const profile = documentSnapshot.data() as UserProfile;
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
                  setUser(credentials, updatedProfile);
                  result?.onAuthorized && result.onAuthorized();
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .catch((e: any) => {
                  log.error(`Failed to add user to firestore: ${e.message}`);
                  result?.onError && result.onError();
                });
            } else {
              setUser(credentials, profile);
              result?.onAuthorized && result.onAuthorized();
            }
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          log.error(
            `Failed to query User collection from firestore: ${e.message}`,
          );
          result?.onError && result.onError();
        });
    } else {
      unauthorizeUser();
      result?.onUnauthorized && result.onUnauthorized();
    }
  };
};

const createProfile = (credentials: FirebaseAuthTypes.User): UserProfile => {
  return {
    name: credentials.displayName,
    email: credentials.email,
    photoUrl: credentials.photoURL,
    roles: [UserRole.User], // All users created with default role.
  } as UserProfile;
};

const useSetUser = () => {
  const dispatch = useDispatch();
  return (credentials: FirebaseAuthTypes.User, profile: UserProfile) => {
    dispatch(
      saveUser({
        user: {
          credentials: JSON.parse(JSON.stringify(credentials)), // Remove non-serializable properties (functions).
          profile,
        },
      }),
    );
    log.debug(`User sign in complete: ${JSON.stringify(profile)}`);
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
