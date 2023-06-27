import { File, saveFile } from 'firebase/storage';

import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendFileMessage = (
  fileMessage: MessageType.PartialFile,
  userProfile: UserProfile,
  group: Group,
) => {
  const message = buildMessage(fileMessage, userProfile);

  saveFile({
    file: { mimeType: message.mimeType, uri: message.uri } as File,
    storagePath: `${appConfig.storageFileChat}/${group.id || 'unknown-group'}/`,
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
