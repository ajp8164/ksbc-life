import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MessageType } from '../react-native-chat-ui';

export type FirestoreMessageType = {
  [key in string]: MessageType.Any & {
    createdAt: MessageType.Any['createdAt'] | FirebaseFirestoreTypes.Timestamp;
  };
};
