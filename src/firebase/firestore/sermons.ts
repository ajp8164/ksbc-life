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

import { Sermon } from 'types/sermon';
import { log } from '@react-native-ajp-elements/core';

export const getSermon = (id: string): Promise<Sermon | undefined> => {
  return getDocument('Sermons', id);
};

export const getSermons = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
  where?: QueryWhere[];
}): Promise<QueryResult<Sermon>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'date', directionStr: 'desc' },
    where,
  } = opts || {};
  return getDocuments('Sermons', { orderBy, limit, lastDocument, where });
};

export const addSermon = (sermon: Sermon): Promise<Sermon> => {
  return (
    firestore()
      .collection('Sermons')
      .add(sermon)
      .then(() => {
        return sermon;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const deleteSermon = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Sermons')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const saveSermon = (sermon: Sermon): Promise<Sermon> => {
  if (sermon.id) {
    return updateSermon(sermon);
  } else {
    return addSermon(sermon);
  }
};

export const updateSermon = (sermon: Sermon): Promise<Sermon> => {
  const updated = Object.assign({}, sermon); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Sermons')
      .doc(id)
      .update(updated)
      .then(() => {
        return sermon;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addSermon(sermon);
        }
        log.error(`Failed to update sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const sermonsCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'date', directionStr: 'desc' },
    ...opts,
  } as CollectionChangeListenerOptions;

  return collectionChangeListener('Sermons', handler, opts);
};

export const sermonsDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Sermons', documentPath, handler);
};
