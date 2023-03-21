import {
  QueryOrderBy,
  QueryResult,
  collectionChangeListener,
  documentChangeListener,
  getDocument,
  getDocuments,
} from 'firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { UserProfile } from 'types/user';
import { log } from '@react-native-ajp-elements/core';

export const getUser = (id: string): Promise<UserProfile | undefined> => {
  return getDocument('Users', id);
};

export const getUsers = (opts?: {
  limit?: number;
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<UserProfile>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('Users', { orderBy, limit, lastDocument });
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

export const usersCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return collectionChangeListener('User', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};

export const usersDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Users', documentPath, handler);
};
