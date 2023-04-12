import {
  QueryOrderBy,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
} from 'firebase/firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { MessageType } from '../../react-native-chat-ui';
import { log } from '@react-native-ajp-elements/core';

const initChatThread = (
  message: MessageType.Any,
  threadId: string,
): Promise<MessageType.Any> => {
  const outgoingMessage = {
    ...message,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
      .set({
        messages: {
          [message.id]: outgoingMessage,
        },
      })
      .then(() => {
        return message;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to init chat thread: ${e.message}`);
        throw e;
      })
  );
};

export const addChatMessage = (
  message: MessageType.Any,
  threadId: string,
): Promise<MessageType.Any> => {
  const outgoingMessage = {
    ...message,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
      .update({
        [`messages.${outgoingMessage.id}`]: outgoingMessage,
      })
      .then(() => {
        return message;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return initChatThread(message, threadId);
        }
        log.error(`Failed to add chat message: ${e.message}`);
        throw e;
      })
  );
};

export const updateChatMessage = (
  property: keyof MessageType.Any,
  message: MessageType.Any,
  threadId: string,
): Promise<MessageType.Any> => {
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
      .update({
        [`messages.${message.id}.${property}`]: message[property],
        [`messages.${message.id}.updatedAt`]:
          firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        return message;
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
  threadId: string,
): Promise<void> => {
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
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
        if (e.message.includes('firestore/not-found')) {
          // If chat thread not initialized just ignore request to set isTyping.
          return;
        }
        log.error(`Failed to add chat message: ${e.message}`);
        throw e;
      })
  );
};

export const chatMessagesCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts?: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
    where?: QueryWhere;
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'createdAt', directionStr: 'desc' },
    where,
  } = opts || {};
  return collectionChangeListener('ChatMessages', handler, {
    lastDocument,
    limit,
    orderBy,
    where,
  });
};

export const chatMessagesDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('ChatMessages', documentPath, handler);
};
