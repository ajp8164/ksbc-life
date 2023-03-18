import firestore from '@react-native-firebase/firestore';

export const getDocumentCount = (col: string): Promise<number> => {
  return firestore()
    .collection(col)
    .count()
    .get()
    .then(snapshot => {
      return snapshot.data().count;
    });
};
