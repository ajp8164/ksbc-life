import { MessageType } from '../../../react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firestore/chatMessages';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const sendTextMessage = (
  message: MessageType.PartialText,
  userProfile: UserProfile,
  threadId: string,
) => {
  const textMessage: MessageType.Text = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    text: message.text,
    type: 'text',
  };
  threadId && addChatMessage(textMessage, threadId);
};
