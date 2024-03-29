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

import { Group } from 'types/group';
import { log } from '@react-native-ajp-elements/core';

export const getGroup = (id: string): Promise<Group | undefined> => {
  return getDocument('Groups', id);
};

export const getGroups = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
  where?: QueryWhere[];
}): Promise<QueryResult<Group>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
    where,
  } = opts || {};
  return getDocuments('Groups', { orderBy, limit, lastDocument, where });
};

export const addGroup = (group: Group): Promise<Group> => {
  return (
    firestore()
      .collection('Groups')
      .add(group)
      .then(data => {
        group.id = data.id;
        return group;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add group document: ${e.message}`);
        throw e;
      })
  );
};

export const updateGroup = (group: Group): Promise<Group> => {
  return (
    firestore()
      .collection('Groups')
      .doc(group.id)
      .update(group)
      .then(() => {
        return group;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addGroup(group);
        }
        log.error(`Failed to update group document: ${e.message}`);
        throw e;
      })
  );
};

export const saveGroup = (group: Group): Promise<Group> => {
  if (group.id) {
    return updateGroup(group);
  } else {
    return addGroup(group);
  }
};

export const deleteGroup = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Groups')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete group document: ${e.message}`);
        throw e;
      })
  );
};

export const groupsCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'name', directionStr: 'asc' },
    ...opts,
  } as CollectionChangeListenerOptions;

  return collectionChangeListener('Groups', handler, opts);
};

export const groupsDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Groups', documentPath, handler);
};
