import {
  Image as ImageUpload,
  Video as VideoUpload,
  uploadImage,
  uploadVideo,
} from 'firebase/storage';

import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendVideoMessage = (
  videoMessage: MessageType.PartialVideo,
  userProfile: UserProfile,
  group: Group,
) => {
  let posterUrl = '';
  let videoUrl = '';

  return new Promise<void>((resolve, reject) => {
    _uploadVideo(videoMessage)
      .then(url => {
        if (url) {
          videoUrl = url;
        } else {
          reject();
        }
        return _uploadPoster(videoMessage);
      })
      .then(url => {
        if (url) {
          posterUrl = url;
        } else {
          reject();
        }
        return send(videoMessage, videoUrl, posterUrl, userProfile, group);
      })
      .then(() => {
        resolve();
      })
      .catch(() => reject());
  });
};

const _uploadVideo = (videoMessage: MessageType.PartialVideo) => {
  return new Promise<string | void>((resolve, reject) => {
    uploadVideo({
      video: {
        mimeType: videoMessage.mimeType,
        uri: videoMessage.uri,
      } as VideoUpload,
      storagePath: appConfig.storageVideoChat,
      onSuccess: url => resolve(url),
      onError: () => reject(),
    });
  });
};

const _uploadPoster = (videoMessage: MessageType.PartialVideo) => {
  return new Promise<string | void>((resolve, reject) => {
    uploadImage({
      image: {
        mimeType: 'image/png',
        uri: videoMessage.posterUri,
      } as ImageUpload,
      storagePath: appConfig.storageVideoChat,
      onSuccess: url => resolve(url),
      onError: () => reject(),
    });
  });
};

const send = async (
  videoMessage: MessageType.PartialVideo,
  videoUrl: string,
  posterUrl: string,
  userProfile: UserProfile,
  group: Group,
) => {
  const message: MessageType.Video = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    height: videoMessage.height,
    metadata: {},
    mimeType: videoMessage.mimeType,
    name: videoUrl?.split('/').pop() ?? '🖼',
    size: videoMessage.size ?? 0,
    posterUri: posterUrl,
    type: 'video',
    uri: videoUrl,
    width: videoMessage.width,
  };
  group.id && (await addChatMessage(message, group.id));

  // Store this message as the latest message posted to this group.
  updateGroupLatestMessageSnippet(message, userProfile, group);
};
