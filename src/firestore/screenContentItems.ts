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

import { ScreenContentItem } from 'types/screenContentItem';
import { log } from '@react-native-ajp-elements/core';

export const getScreenContentItem = (
  id: string,
): Promise<ScreenContentItem | undefined> => {
  return getDocument('ScreenContentItems', id);
};

export const getScreenContentItems = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<ScreenContentItem>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('ScreenContentItems', { orderBy, limit, lastDocument });
};

export const addScreenContentItem = (
  screenContentItem: ScreenContentItem,
): Promise<ScreenContentItem> => {
  return (
    firestore()
      .collection('ScreenContentItems')
      .add(screenContentItem)
      .then(() => {
        return screenContentItem;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add screen content item document: ${e.message}`);
        throw e;
      })
  );
};

export const updateScreenContentItem = (
  screenContentItem: ScreenContentItem,
): Promise<ScreenContentItem> => {
  const updated = Object.assign({}, screenContentItem); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('ScreenContentItems')
      .doc(id)
      .update(updated)
      .then(() => {
        return screenContentItem;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addScreenContentItem(screenContentItem);
        }
        log.error(
          `Failed to update screen content item document: ${e.message}`,
        );
        throw e;
      })
  );
};

export const saveScreenContentItem = (
  screenContentItem: ScreenContentItem,
): Promise<ScreenContentItem> => {
  if (screenContentItem.id) {
    return updateScreenContentItem(screenContentItem);
  } else {
    return addScreenContentItem(screenContentItem);
  }
};

export const deleteScreenContentItem = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('ScreenContentItems')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(
          `Failed to delete screen content item document: ${e.message}`,
        );
        throw e;
      })
  );
};

export const screenContentItemCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: {
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
  return collectionChangeListener('ScreenContentItems', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};

export const screenContentItemDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('ScreenContentItems', documentPath, handler);
};
