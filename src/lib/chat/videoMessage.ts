import {
  uploadImage as FSUploadImage,
  uploadVideo as FSUploadVideo,
  Image as ImageUpload,
  Video as VideoUpload,
} from 'firebase/storage';

import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { appConfig } from 'config';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const buildMessage = (
  message: MessageType.PartialVideo,
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
    posterUri: message.posterUri,
    type: 'video',
    uri: message.uri,
    width: message.width,
  } as MessageType.Video;
};

export const uploadVideoPoster = (
  message: MessageType.PartialVideo,
  container?: string,
) => {
  return new Promise<string>((resolve, reject) => {
    FSUploadImage({
      image: {
        mimeType: 'image/png',
        uri: message.posterUri,
      } as ImageUpload,
      storagePath: `${appConfig.storageVideoChat}/${
        container || 'unknown-group'
      }/`,
      onSuccess: resolve,
      onError: reject,
    });
  });
};

export const uploadVideo = (
  message: MessageType.PartialVideo,
  container?: string,
) => {
  return new Promise<string>((resolve, reject) => {
    FSUploadVideo({
      video: {
        mimeType: message.mimeType,
        uri: message.uri,
      } as VideoUpload,
      storagePath: `${appConfig.storageVideoChat}/${
        container || 'unknown-group'
      }/`,
      onSuccess: resolve,
      onError: reject,
    });
  });
};
