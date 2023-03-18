import { Pasteur } from 'types/pasteur';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export type PasteursQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  pasteurs: Pasteur[];
};

export const getPasteur = (id: string): Promise<Pasteur | undefined> => {
  return (
    firestore()
      .collection('Pasteurs')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const pasteur = {
            ...documentSnapshot.data(),
            id,
          };
          return pasteur as Pasteur;
        } else {
          return;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get pastuer document: ${e.message}`);
        throw e;
      })
  );
};

export const getPasteurs = (
  limit: number,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): Promise<PasteursQueryResult> => {
  let query = firestore().collection('Pasteurs').orderBy('firstName', 'asc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }

  return (
    query
      .limit(limit || 1) // Must be positive value
      .get()
      .then(querySnapshot => {
        const pasteurs: Pasteur[] = [];
        querySnapshot.forEach(doc => {
          const pasteur = <Pasteur>doc.data();
          pasteur.id = doc.id;
          pasteurs.push(pasteur);
        });
        return {
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
          pasteurs,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get pasteur documents: ${e.message}`);
        throw e;
      })
  );
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
