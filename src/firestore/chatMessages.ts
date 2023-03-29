import {
  QueryOrderBy,
  QueryResult,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
  getDocuments,
} from 'firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { ChatMessage } from 'types/chatMessage';
import { log } from '@react-native-ajp-elements/core';
import { uuidv4 } from 'lib/uuid';

export const getChatMessages = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<ChatMessage>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'createdAt', directionStr: 'desc' },
  } = opts || {};
  return getDocuments('ChatMessages', { orderBy, limit, lastDocument });
};

export const initChatThread = (
  message: ChatMessage,
  threadId: string,
): Promise<ChatMessage> => {
  const key = uuidv4();
  const outgoingMessage = {
    ...message,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
      .set({ [key]: outgoingMessage })
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
  message: ChatMessage,
  threadId: string,
): Promise<ChatMessage> => {
  const key = uuidv4();
  const outgoingMessage = {
    ...message,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };
  return (
    firestore()
      .collection('ChatMessages')
      .doc(threadId)
      .update({ [key]: outgoingMessage })
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
