import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore/chatMessages';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const sendTextMessage = (
  message: MessageType.PartialText,
  userProfile: UserProfile,
  group: Group,
) => {
  const textMessage: MessageType.Text = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: message.metadata || {},
    previewData: message.previewData || {},
    text: message.text,
    type: 'text',
  };
  group.id && addChatMessage(textMessage, group.id);
};
