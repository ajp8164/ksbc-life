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

import { Pasteur } from 'types/pasteur';
import { log } from '@react-native-ajp-elements/core';

export const getPasteur = (id: string): Promise<Pasteur | undefined> => {
  return getDocument('Pasteurs', id);
};

export const getPasteurs = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
  where?: QueryWhere[];
}): Promise<QueryResult<Pasteur>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'firstName', directionStr: 'asc' },
    where,
  } = opts || {};
  return getDocuments('Pasteurs', { orderBy, limit, lastDocument, where });
};

export const addPasteur = (pasteur: Pasteur): Promise<Pasteur> => {
  return (
    firestore()
      .collection('Pasteurs')
      .add(pasteur)
      .then(() => {
        return pasteur;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add pasteur document: ${e.message}`);
        throw e;
      })
  );
};

export const updatePasteur = (pasteur: Pasteur): Promise<Pasteur> => {
  const updated = Object.assign({}, pasteur); // Don't mutate input.
  const id = updated.id;
  delete updated.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Pasteurs')
      .doc(id)
      .update(updated)
      .then(() => {
        return pasteur;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addPasteur(pasteur);
        }
        log.error(`Failed to update pasteur document: ${e.message}`);
        throw e;
      })
  );
};

export const savePasteur = (pasteur: Pasteur): Promise<Pasteur> => {
  if (pasteur.id) {
    return updatePasteur(pasteur);
  } else {
    return addPasteur(pasteur);
  }
};

export const deletePasteur = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Pasteurs')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete pasteur document: ${e.message}`);
        throw e;
      })
  );
};

export const pasteursCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'firstName', directionStr: 'asc' },
    ...opts,
  } as CollectionChangeListenerOptions;
  return collectionChangeListener('Pasteurs', handler, opts);
};

export const pasteursDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('Pasteurs', documentPath, handler);
};
