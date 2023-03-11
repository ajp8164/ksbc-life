import firestore from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export const collectionnChangeListener = (
  col: string,
  handler: () => void,
): (() => void) => {
  return firestore()
    .collection(col)
    .onSnapshot(handler, (e: Error) => {
      log.error(`Failed onSnapshot for ${col} collection: ${e.message}`);
    });
};

export const documentChangeListener = (
  col: string,
  doc: string,
  handler: () => void,
): (() => void) => {
  return firestore()
    .collection(col)
    .doc(doc)
    .onSnapshot(handler, (e: Error) => {
      log.error(`Failed onSnapshot for ${col}.${doc} document: ${e.message}`);
    });
};
