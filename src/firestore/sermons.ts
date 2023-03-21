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

import { Sermon } from 'types/sermon';
import { log } from '@react-native-ajp-elements/core';

export const getSermon = (id: string): Promise<Sermon | undefined> => {
  return getDocument('Sermons', id);
};

export const getSermons = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<Sermon>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'date', directionStr: 'desc' },
  } = opts || {};
  return getDocuments('Sermons', { orderBy, limit, lastDocument });
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
  const id = sermon.id;
  delete sermon.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Sermons')
      .doc(id)
      .update(sermon)
      .then(() => {
        return sermon;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to update sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const sermonsCollectionChangeListener = (
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
    orderBy = { fieldPath: 'date', directionStr: 'desc' },
  } = opts;
  return collectionChangeListener('Sermons', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};
