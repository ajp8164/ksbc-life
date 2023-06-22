import {
  uploadImage as FSUploadImage,
  uploadVideo as FSUploadVideo,
  Image as ImageUpload,
  Video as VideoUpload,
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
  const message = buildMessage(videoMessage, userProfile);
  let posterUrl = '';
  let videoUrl = '';

  uploadVideo(message, group.id)
    .then(url => {
      videoUrl = url;
      return uploadPoster(message);
    })
    .then(url => {
      posterUrl = url;
      // Update message with uri's from uploaded assets.
      message.posterUri = posterUrl;
      message.uri = videoUrl;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addChatMessage(message, group.id!);
    })
    .then(() => {
      // Store this message as the latest message posted to this group.
      updateGroupLatestMessageSnippet(message, userProfile, group);
    })
    .catch(() => {
      // Message failed to send.
    });

  // Prevent blocking the UI during upload by returning locally created message (local video/poster url's).
  return message;
};

const uploadVideo = (message: MessageType.PartialVideo, container?: string) => {
  return new Promise<string>((resolve, reject) => {
    FSUploadVideo({
      video: {
        mimeType: message.mimeType,
        uri: message.uri,
      } as VideoUpload,
      storagePath: `${appConfig.storageVideoChat}/${
        container || 'unknown-group'
      }/`,
      onSuccess: url => resolve(url),
      onError: () => reject(),
    });
  });
};

const uploadPoster = (message: MessageType.PartialVideo) => {
  return new Promise<string>((resolve, reject) => {
    FSUploadImage({
      image: {
        mimeType: 'image/png',
        uri: message.posterUri,
      } as ImageUpload,
      storagePath: appConfig.storageVideoChat,
      onSuccess: url => resolve(url),
      onError: () => reject(),
    });
  });
};

const buildMessage = (
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
