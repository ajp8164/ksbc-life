import {
  CollectionChangeListenerOptions,
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

import { Church } from 'types/church';
import { log } from '@react-native-ajp-elements/core';

export const getChurch = (id: string): Promise<Church | undefined> => {
  return getDocument('Churches', id);
};

export const getChurches = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
  where?: QueryWhere[];
}): Promise<QueryResult<Church>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
    where,
  } = opts || {};
  return getDocuments('Churches', { orderBy, limit, lastDocument, where });
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
  const updated = Object.assign({}, church); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Churches')
      .doc(id)
      .update(updated)
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
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'name', directionStr: 'asc' },
    ...opts,
  } as CollectionChangeListenerOptions;

  return collectionChangeListener('Churches', handler, opts);
};

export const churchesDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Churches', documentPath, handler);
};
