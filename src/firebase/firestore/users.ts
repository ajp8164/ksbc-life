import {
  QueryOrderBy,
  QueryResult,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
  getDocument,
  getDocuments,
} from 'firebase/firestore/utils';
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
  where?: QueryWhere[];
}): Promise<QueryResult<UserProfile>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
    where,
  } = opts || {};
  return getDocuments('Users', { lastDocument, orderBy, limit, where });
};

export const updateUser = (user: UserProfile): Promise<UserProfile> => {
  const updated = Object.assign({}, user); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Users')
      .doc(id)
      .update(updated)
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

export const deleteUser = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Users')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete user document: ${e.message}`);
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
    where?: QueryWhere[];
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
    where,
  } = opts || {};
  return collectionChangeListener('Users', handler, {
    lastDocument,
    limit,
    orderBy,
    where,
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
