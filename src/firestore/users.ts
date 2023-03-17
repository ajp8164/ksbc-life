import { UserProfile } from 'types/user';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export type UsersQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  users: UserProfile[];
};

export const getUser = (id: string): Promise<UserProfile | undefined> => {
  return (
    firestore()
      .collection('Users')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const user = {
            ...documentSnapshot.data(),
            id,
          };
          return user as UserProfile;
        } else {
          return;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get user document: ${e.message}`);
        throw e;
      })
  );
};

export const getUsers = (
  limit: number,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): Promise<UsersQueryResult> => {
  let query = firestore().collection('Users').orderBy('name', 'asc');

  if (lastDocument !== undefined) {
    query = query.startAfter(lastDocument);
  }

  return (
    query
      .limit(limit || 1) // Must be positive value
      .get()
      .then(querySnapshot => {
        const users: UserProfile[] = [];
        querySnapshot.forEach(doc => {
          const user = <UserProfile>doc.data();
          user.id = doc.id;
          users.push(user);
        });
        return {
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
          users,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get user document: ${e.message}`);
        throw e;
      })
  );
};

export const updateUser = (user: UserProfile): Promise<UserProfile> => {
  const id = user.id;
  delete user.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Users')
      .doc(id)
      .update(user)
      .then(() => {
        return user;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to update user document: ${e.message}`);
        throw e;
      })
  );
};
