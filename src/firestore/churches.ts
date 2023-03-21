import {
  QueryOrderBy,
  QueryResult,
  collectionChangeListener,
  getDocument,
  getDocuments,
} from 'firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { Church } from 'types/church';
import { log } from '@react-native-ajp-elements/core';

export const getChurch = (id: string): Promise<Church | undefined> => {
  return getDocument('Churches', id);
};

export const getChurches = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<Church>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('Churches', { orderBy, limit, lastDocument });
};

export const addChurch = (church: Church): Promise<Church> => {
  return (
    firestore()
      .collection('Churches')
      .add(church)
      .then(() => {
        return church;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add church document: ${e.message}`);
        throw e;
      })
  );
};

export const updateChurch = (church: Church): Promise<Church> => {
  const id = church.id;
  delete church.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Churches')
      .doc(id)
      .update(church)
      .then(() => {
        return church;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addChurch(church);
        }
        log.error(`Failed to update church document: ${e.message}`);
        throw e;
      })
  );
};

export const saveChurch = (church: Church): Promise<Church> => {
  if (church.id) {
    return updateChurch(church);
  } else {
    return addChurch(church);
  }
};

export const churchCollectionChangeListener = (
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
  } = opts;
  return collectionChangeListener('Churches', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};