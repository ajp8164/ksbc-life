import { Church, Pasteur } from 'types/church';

import firestore from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';

export const getChurch = (): Promise<Church> => {
  return firestore()
    .collection('Church')
    .doc('Church')
    .get()
    .then(documentSnapshot => {
      return documentSnapshot.data() as Church;
    });
};

export const getPasteurs = (): Promise<Pasteur[]> => {
  return getChurch().then(church => {
    return (church.pasteurs || []) as Pasteur[];
  });
};

export const getPasteur = (id: string): Promise<Pasteur | undefined> => {
  return getChurch().then(church => {
    const pasteurs = church.pasteurs as Pasteur[];
    return pasteurs.find(pasteur => {
      return pasteur.id === id;
    });
  });
};

export const updateChurch = (church: Church): Promise<void> => {
  console.log('updateChurch', church);
  return (
    firestore()
      .collection('Church')
      .doc('Church')
      .update(church)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to save Church document: ${e.message}`);
        throw e;
      })
  );
};

export const updatePasteur = (pasteur: Pasteur): Promise<void> => {
  return getChurch().then(church => {
    lodash.remove(church.pasteurs, p => {
      return p.id === pasteur.id;
    });
    church.pasteurs.push(pasteur);
    return updateChurch(church);
  });
};
