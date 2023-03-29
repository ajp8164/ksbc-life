import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { IChatMessage } from 'react-native-gifted-chat';

export type ChatMessage = IChatMessage & {
  id?: string;
  createdAt: IChatMessage['createdAt'] & FirebaseFirestoreTypes.Timestamp;
};
