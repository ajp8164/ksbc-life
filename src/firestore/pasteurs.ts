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

import { Pasteur } from 'types/pasteur';
import { log } from '@react-native-ajp-elements/core';

export type PasteursQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  pasteurs: Pasteur[];
};

export const getPasteur = (id: string): Promise<Pasteur | undefined> => {
  return getDocument('Pasteurs', id);
};

export const getPasteurs = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<Pasteur>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'firstName', directionStr: 'asc' },
  } = opts || {};
  return getDocuments('Pasteurs', { orderBy, limit, lastDocument });
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
  const id = pasteur.id;
  delete pasteur.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Pasteurs')
      .doc(id)
      .update(pasteur)
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
  opts: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'firstName', directionStr: 'asc' },
  } = opts;
  return collectionChangeListener('Pasteurs', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};