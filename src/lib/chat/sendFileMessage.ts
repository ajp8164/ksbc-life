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
  return new Promise<void>((resolve, reject) => {
    saveFile({
      file: { mimeType: fileMessage.mimeType, uri: fileMessage.uri } as File,
      storagePath: appConfig.storageFileChat,
      onSuccess: async url => {
        await send(fileMessage, url, userProfile, group);
        resolve();
      },
      onError: () => {
        reject();
      },
    });
  });
};

const send = async (
  fileMessage: MessageType.PartialFile,
  url: string,
  userProfile: UserProfile,
  group: Group,
) => {
  const message: MessageType.File = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: {},
    mimeType: fileMessage.type ?? undefined,
    name: fileMessage.name || `tmp-${uuidv4()}`,
    size: fileMessage.size ?? 0,
    type: 'file',
    uri: url,
  };
  group.id && (await addChatMessage(message, group.id));

  // Store this message as the latest message posted to this group.
  updateGroupLatestMessageSnippet(message, userProfile, group);
};
