import {
  CollectionChangeListenerOptions,
  collectionChangeListener,
  documentChangeListener,
} from 'firebase/firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { MessageType } from '@flyerhq/react-native-chat-ui';
import { log } from '@react-native-ajp-elements/core';

export const addChatMessage = (
  message: MessageType.Any,
  groupId: string,
): Promise<MessageType.Any> => {
  const outgoingMessage = {
    ...message,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  return (
    firestore()
      .collection('ChatMessages')
      .doc(groupId)
      .collection('Messages')
      .doc(message.id)
      .set(outgoingMessage)
      .then(() => {
        return message;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add chat message: ${e.message}`);
        throw e;
      })
  );
};

export const updateChatMessage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: { [key in string]: any },
  messageId: string,
  groupId: string,
): Promise<void> => {
  return (
    firestore()
      .collection('ChatMessages')
      .doc(groupId)
      .collection('Messages')
      .doc(messageId)
      .update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to update chat message document: ${e.message}`);
        throw e;
      })
  );
};

export const sendTypingState = (
  isTyping: boolean,
  userId: string,
  username: string,
  groupId: string,
): Promise<void> => {
  return (
    firestore()
      .collection('Groups')
      .doc(groupId)
      .update({
        isTyping: isTyping
          ? firestore.FieldValue.arrayUnion({ [userId]: username })
          : firestore.FieldValue.arrayRemove({ [userId]: username }),
      })
      .then(() => {
        return;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to update chat typing state: ${e.message}`);
        throw e;
      })
  );
};

export const chatMessagesCollectionChangeListener = (
  groupId: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'createdAt', directionStr: 'desc' },
    subCollection: { documentPath: groupId, name: 'Messages' },
    ...opts,
  } as CollectionChangeListenerOptions;

  return collectionChangeListener('ChatMessages', handler, opts);
};

export const chatMessagesDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('ChatMessages', documentPath, handler);
};
