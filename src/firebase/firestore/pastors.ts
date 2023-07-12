import {
  CollectionChangeListenerOptions,
  QueryOrderBy,
  QueryResult,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
  getDocument,
  getDocuments,
} from '.';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { Pastor } from 'types/pastor';
import { log } from '@react-native-ajp-elements/core';

export const getPastor = (id: string): Promise<Pastor | undefined> => {
  return getDocument('Pastors', id);
};

export const getPastors = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
  where?: QueryWhere[];
}): Promise<QueryResult<Pastor>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'firstName', directionStr: 'asc' },
    where,
  } = opts || {};
  return getDocuments('Pastors', { orderBy, limit, lastDocument, where });
};

export const addPastor = (pastor: Pastor): Promise<Pastor> => {
  return (
    firestore()
      .collection('Pastors')
      .add(pastor)
      .then(() => {
        return pastor;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add pastor document: ${e.message}`);
        throw e;
      })
  );
};

export const updatePastor = (pastor: Pastor): Promise<Pastor> => {
  const updated = Object.assign({}, pastor); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Pastors')
      .doc(id)
      .update(updated)
      .then(() => {
        return pastor;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addPastor(pastor);
        }
        log.error(`Failed to update pastor document: ${e.message}`);
        throw e;
      })
  );
};

export const savePastor = (pastor: Pastor): Promise<Pastor> => {
  if (pastor.id) {
    return updatePastor(pastor);
  } else {
    return addPastor(pastor);
  }
};

export const deletePastor = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Pastors')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete pastor document: ${e.message}`);
        throw e;
      })
  );
};

export const pastorsCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'firstName', directionStr: 'asc' },
    ...opts,
  } as CollectionChangeListenerOptions;
  return collectionChangeListener('Pastors', handler, opts);
};

export const pastorsDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Pastors', documentPath, handler);
};
