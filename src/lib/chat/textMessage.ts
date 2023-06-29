import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const buildMessage = (
  message: MessageType.PartialText,
  userProfile: UserProfile,
) => {
  return {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: message.metadata || {},
    previewData: message.previewData || {},
    text: message.text,
    type: 'text',
  } as MessageType.Text;
};
