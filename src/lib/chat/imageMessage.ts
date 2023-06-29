import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const buildMessage = (
  message: MessageType.PartialImage,
  userProfile: UserProfile,
) => {
  return {
    id: uuidv4(),
    author: createAuthor(userProfile),
    height: message.height,
    metadata: {},
    mimeType: message.mimeType,
    name: message.uri?.split('/').pop() ?? '🖼',
    size: message.size ?? 0,
    type: 'image',
    uri: message.uri,
    width: message.width,
  } as MessageType.Image;
};
