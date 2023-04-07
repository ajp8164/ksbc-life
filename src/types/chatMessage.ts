import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MessageType } from '@flyerhq/react-native-chat-ui';

export type ChatMessage =
  | (MessageType.Any | MessageType.Text | MessageType.Image) & {
      createdAt?:
        | MessageType.Any['createdAt']
        | MessageType.Text['createdAt']
        | MessageType.Image['createdAt']
        | FirebaseFirestoreTypes.Timestamp;
    };
