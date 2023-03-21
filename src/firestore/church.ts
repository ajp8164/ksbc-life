import { Church } from 'types/church';
import firestore from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export const getChurch = (): Promise<Church> => {
  return firestore()
    .collection('Church')
    .doc('Church')
    .get()
    .then(documentSnapshot => {
      if (!documentSnapshot.exists) {
        return addChurch();
      } else {
        return documentSnapshot.data() as Church;
      }
    });
};

export const addChurch = (): Promise<Church> => {
  // Initialize the church doc.
  const church: Church = {
    name: 'My Church',
    shortName: '',
    values: '',
    beliefs: '',
    photoUrl: '',
  };
  return (
    firestore()
      .collection('Church')
      .doc('Church')
      .set(church)
      .then(() => {
        return church;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add pasteur document: ${e.message}`);
        throw e;
      })
  );
};

export const updateChurch = (church: Church): Promise<Church> => {
  return (
    firestore()
      .collection('Church')
      .doc('Church')
      .update(church)
      .then(() => {
        return church;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addChurch();
        }
        log.error(`Failed to update church document: ${e.message}`);
        throw e;
      })
  );
};

export const saveChurch = (church: Church): Promise<Church> => {
  if (church.id) {
    return updateChurch(church);
  } else {
    return addChurch();
  }
};
