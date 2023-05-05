import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
// import { MessageType } from '@flyerhq/react-native-chat-ui';
import { MessageType } from '../../../react-native-chat-ui/src';

export type FirestoreMessageType =
  | MessageType.Any
  | (Omit<MessageType.Any, 'createdAt'> &
      Omit<MessageType.Any, 'updatedAt'> & {
        createdAt: FirebaseFirestoreTypes.Timestamp;
        updatedAt: FirebaseFirestoreTypes.Timestamp;
      });

export enum SearchScope {
  Username,
}

export type SearchCriteria = {
  text: string;
  scope: SearchScope;
};
