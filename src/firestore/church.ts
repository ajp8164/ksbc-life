import { Church, Pasteur } from 'types/church';

import firestore from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { log } from '@react-native-ajp-elements/core';

const initialChurch: Church = {
  pasteurs: [],
  sermons: [],
};

export const getChurch = (): Promise<Church> => {
  return firestore()
    .collection('Church')
    .doc('Church')
    .get({ source: 'cache' })
    .then(documentSnapshot => {
      if (!documentSnapshot.data()) {
        return readChurch();
      } else {
        return documentSnapshot.data() as Church;
      }
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

export const putPasteur = (pasteur: Pasteur): Promise<void> => {
  return getChurch().then(church => {
    lodash.remove(church.pasteurs, p => {
      return p.id === pasteur.id;
    });
    church.pasteurs.push(pasteur);
    return updateChurch(church);
  });
};

const readChurch = (): Promise<Church> => {
  return firestore()
    .collection('Church')
    .doc('Church')
    .get()
    .then(documentSnapshot => {
      return (documentSnapshot.data() as Church) || initialChurch;
    })
    .catch((e: Error) => {
      log.error(`Failed to read Church document: ${e.message}`);
      throw e;
    });
};

const updateChurch = (church: Church): Promise<void> => {
  console.log('updateChurch', church);
  let retry = false;
  return firestore()
    .collection('Church')
    .doc('Church')
    .update(church)
    .catch((e: Error) => {
      if (e.message.includes('firestore/not-found') && !retry) {
        // Document not found. Create it and retry.
        retry = true;
        return initChurch()
          .then(() => updateChurch(church))
          .catch((e: Error) => {
            throw e;
          });
      } else {
        log.error(`Failed to save Church document: ${e.message}`);
        throw e;
      }
    });
};

const initChurch = (): Promise<void> => {
  console.log('initChurch');
  return firestore()
    .collection('Church')
    .doc('Church')
    .set(initialChurch)
    .catch((e: Error) => {
      log.error(`Failed to  initialize Church document: ${e.message}`);
      throw e;
    });
};
