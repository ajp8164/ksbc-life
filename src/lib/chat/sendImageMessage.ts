import { Asset } from 'react-native-image-picker';
import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { saveImage } from 'firebase/storage';
import { selectImage } from '@react-native-ajp-elements/ui';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendImageMessage = (userProfile: UserProfile, group: Group) => {
  selectImage({
    onSuccess: async imageAssets => {
      const imageAsset = imageAssets[0];
      if (imageAsset) {
        await saveImage({
          imageAsset,
          storagePath: appConfig.storageImageChat,
          onSuccess: url => send(imageAsset, url, userProfile, group),
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
  group: Group,
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
  group.id && addChatMessage(imageMessage, group.id);

  // Store this message as the latest message posted to this group.
  updateGroupLatestMessageSnippet(imageMessage, userProfile, group);
};
