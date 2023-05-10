import { Image as ImageUpload, uploadImage } from 'firebase/storage';

import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendImageMessage = (
  imageMessage: MessageType.PartialImage,
  userProfile: UserProfile,
  group: Group,
) => {
  return new Promise<void>((resolve, reject) => {
    uploadImage({
      image: {
        mimeType: imageMessage.mimeType,
        uri: imageMessage.uri,
      } as ImageUpload,
      storagePath: appConfig.storageImageChat,
      onSuccess: async url => {
        await send(imageMessage, url, userProfile, group);
        resolve();
      },
      onError: () => {
        reject();
      },
    });
  });
};

const send = async (
  imageMessage: MessageType.PartialImage,
  url: string,
  userProfile: UserProfile,
  group: Group,
) => {
  const message: MessageType.Image = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    height: imageMessage.height,
    metadata: {},
    mimeType: imageMessage.mimeType,
    name: url?.split('/').pop() ?? '🖼',
    size: imageMessage.size ?? 0,
    type: 'image',
    uri: url,
    width: imageMessage.width,
  };
  group.id && (await addChatMessage(message, group.id));

  // Store this message as the latest message posted to this group.
  updateGroupLatestMessageSnippet(message, userProfile, group);
};
