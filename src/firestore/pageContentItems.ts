import {
  QueryOrderBy,
  QueryResult,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
  getDocument,
  getDocuments,
} from 'firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { PageContentItem } from 'types/pageContentItem';
import { log } from '@react-native-ajp-elements/core';

export const getPageContentItem = (
  id: string,
): Promise<PageContentItem | undefined> => {
  return getDocument('PageContentItems', id);
};

export const getPageContentItems = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<PageContentItem>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('PageContentItems', { orderBy, limit, lastDocument });
};

export const addPageContentItem = (
  pageContentItem: PageContentItem,
): Promise<PageContentItem> => {
  return (
    firestore()
      .collection('PageContentItems')
      .add(pageContentItem)
      .then(() => {
        return pageContentItem;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add screen content item document: ${e.message}`);
        throw e;
      })
  );
};

export const updatePageContentItem = (
  pageContentItem: PageContentItem,
): Promise<PageContentItem> => {
  const updated = Object.assign({}, pageContentItem); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('PageContentItems')
      .doc(id)
      .update(updated)
      .then(() => {
        return pageContentItem;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addPageContentItem(pageContentItem);
        }
        log.error(
          `Failed to update screen content item document: ${e.message}`,
        );
        throw e;
      })
  );
};

export const savePageContentItem = (
  pageContentItem: PageContentItem,
): Promise<PageContentItem> => {
  if (pageContentItem.id) {
    return updatePageContentItem(pageContentItem);
  } else {
    return addPageContentItem(pageContentItem);
  }
};

export const deletePageContentItem = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('PageContentItems')
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

export const pageContentItemCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
    where?: QueryWhere;
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
    where,
  } = opts || {};
  return collectionChangeListener('PageContentItems', handler, {
    lastDocument,
    limit,
    orderBy,
    where,
  });
};

export const pageContentItemDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('PageContentItems', documentPath, handler);
};
