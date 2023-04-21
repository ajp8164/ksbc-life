import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import { Alert } from 'react-native';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { log } from '@react-native-ajp-elements/core';
import { saveFile } from 'firebase/storage';
import { uuidv4 } from 'lib/uuid';

export const sendFileMessage = async (
  userProfile: UserProfile,
  groupId: string,
) => {
  const file = await DocumentPicker.pickSingle({
    type: [DocumentPicker.types.allFiles],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).catch((e: any) => {
    if (!e.message.includes('cancelled')) {
      Alert.alert(
        'File Selection Error',
        'An error occurred while accessing your files. Please try again.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
      const msg = `File select error: ${e.message}`;
      log.error(msg);
    }
  });

  if (file) {
    await saveFile({
      file,
      storagePath: appConfig.storageFileChat,
      onSuccess: url => send(file, url, userProfile, groupId),
      onError: () => {
        return;
      },
    });
  }
};

const send = (
  file: DocumentPickerResponse,
  url: string,
  userProfile: UserProfile,
  groupId: string,
) => {
  const fileMessage: MessageType.File = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: {},
    mimeType: file.type ?? undefined,
    name: file.name || `tmp-${uuidv4()}`,
    size: file.size ?? 0,
    type: 'file',
    uri: url,
  };
  addChatMessage(fileMessage, groupId);
};
