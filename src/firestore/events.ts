import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { log } from '@react-native-ajp-elements/core';

export const collectionChangeListener = (
  col: string,
  handler: () => void,
): (() => void) => {
  return (
    firestore()
      .collection(col)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .onSnapshot(handler, (e: any) => {
        log.error(`Failed onSnapshot for ${col} collection: ${e.message}`);
      })
  );
};

export const documentChangeListener = (
  col: string,
  doc: string,
  handler: (
    documentSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return (
    firestore()
      .collection(col)
      .doc(doc)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .onSnapshot(handler, (e: any) => {
        if (!e.message.includes('firestore/permission-denied')) {
          log.error(
            `Failed onSnapshot for ${col}.${doc} document: ${e.message}`,
          );
        }
      })
  );
};
