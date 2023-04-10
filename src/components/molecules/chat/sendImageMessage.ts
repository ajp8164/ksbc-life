import { Asset } from 'react-native-image-picker';
import { MessageType } from '../../../react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore/chatMessages';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { saveImage } from 'firebase/storage/image';
import { selectImage } from '@react-native-ajp-elements/ui';
import { uuidv4 } from 'lib/uuid';

export const sendImageMessage = (
  userProfile: UserProfile,
  threadId: string,
) => {
  selectImage({
    onSuccess: async imageAssets => {
      const imageAsset = imageAssets[0];
      if (imageAsset) {
        await saveImage({
          imageAsset,
          storagePath: appConfig.storageImageChat,
          onSuccess: url => send(imageAsset, url, userProfile, threadId),
          onError: () => {
            return;
          },
        });
      }
    },
  });
};

const send = (
  imageAsset: Asset,
  url: string,
  userProfile: UserProfile,
  threadId: string,
) => {
  const imageMessage: MessageType.Image = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    height: imageAsset.height,
    metadata: {},
    name: url?.split('/').pop() ?? '🖼',
    size: imageAsset.fileSize ?? 0,
    type: 'image',
    uri: url,
    width: imageAsset.width,
  };
  threadId && addChatMessage(imageMessage, threadId);
};
