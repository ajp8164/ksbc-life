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

import { Location } from 'types/location';
import { log } from '@react-native-ajp-elements/core';

export const getLocation = (id: string): Promise<Location | undefined> => {
  return getDocument('Locations', id);
};

export const getLocations = (opts?: {
  limit?: number;
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<Location>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'name', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('Locations', { orderBy, limit, lastDocument });
};

export const addLocation = (location: Location): Promise<Location> => {
  return (
    firestore()
      .collection('Locations')
      .add(location)
      .then(documentSnapshot => {
        location.id = documentSnapshot.id;
        return location;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add location document: ${e.message}`);
        throw e;
      })
  );
};

export const updateLocation = (location: Location): Promise<Location> => {
  const id = location.id;
  delete location.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Locations')
      .doc(id)
      .update(location)
      .then(() => {
        return location;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addLocation(location);
        }
        log.error(`Failed to update location document: ${e.message}`);
        throw e;
      })
  );
};

export const saveLocation = (location: Location): Promise<Location> => {
  if (location.id) {
    return updateLocation(location);
  } else {
    return addLocation(location);
  }
};

export const deleteLocation = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Locations')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete location document: ${e.message}`);
        throw e;
      })
  );
};

export const locationsCollectionChangeListener = (
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
  return collectionChangeListener('Locations', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};

export const locationsDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Locations', documentPath, handler);
};
