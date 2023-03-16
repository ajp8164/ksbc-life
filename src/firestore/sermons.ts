import { Sermon } from 'types/church';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export type SermonsQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  sermons: Sermon[];
};

export const getSermons = (
  limit: number,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): Promise<SermonsQueryResult> => {
  let query = firestore().collection('Sermons').orderBy('date', 'desc');

  if (lastDocument !== undefined) {
    query = query.startAfter(lastDocument);
  }

  return (
    query
      .limit(limit || 1) // Must be positive value
      .get()
      .then(querySnapshot => {
        const sermons: Sermon[] = [];
        querySnapshot.forEach(doc => {
          const sermon = <Sermon>doc.data();
          sermon.id = doc.id;
          sermons.push(sermon);
        });
        return {
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
          sermons,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const addSermon = (sermon: Sermon): Promise<Sermon> => {
  return (
    firestore()
      .collection('Sermons')
      .add(sermon)
      .then(() => {
        return sermon;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const deleteSermon = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Sermons')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete sermon document: ${e.message}`);
        throw e;
      })
  );
};

export const saveSermon = (sermon: Sermon): Promise<Sermon> => {
  if (sermon.id) {
    return updateSermon(sermon);
  } else {
    return addSermon(sermon);
  }
};

export const updateSermon = (sermon: Sermon): Promise<Sermon> => {
  const id = sermon.id;
  delete sermon.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Sermons')
      .doc(id)
      .update(sermon)
      .then(() => {
        return sermon;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to save sermon document: ${e.message}`);
        throw e;
      })
  );
};
