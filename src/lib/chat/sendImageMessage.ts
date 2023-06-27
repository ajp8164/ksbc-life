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
  const message = buildMessage(imageMessage, userProfile);

  uploadImage({
    image: { mimeType: message.mimeType, uri: message.uri } as ImageUpload,
    storagePath: `${appConfig.storageImageChat}/${
      group.id || 'unknown-group'
    }/`,
    onSuccess: url => {
      // Update message with uri's from uploaded assets.
      message.uri = url;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addChatMessage(message, group.id!)
        .then(() => {
          // Store this message as the latest message posted to this group.
          updateGroupLatestMessageSnippet(message, userProfile, group);
        })
        .catch(() => {
          // Message failed to send.
        });
    },
    onError: () => {
      // Message failed to send.
    },
  });

  // Prevent blocking the UI during upload by returning locally created message (local video/poster url's).
  // Return a copy to prevent any mutation by the caller.
  return Object.assign({}, message);
};

const buildMessage = (
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
