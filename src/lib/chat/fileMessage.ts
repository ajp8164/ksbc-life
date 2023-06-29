import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const buildMessage = (
  message: MessageType.PartialFile,
  userProfile: UserProfile,
) => {
  return {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: {},
    mimeType: message.mimeType,
    name: message.name || `tmp-${uuidv4()}`,
    size: message.size ?? 0,
    type: 'file',
    uri: message.uri,
  } as MessageType.File;
};
