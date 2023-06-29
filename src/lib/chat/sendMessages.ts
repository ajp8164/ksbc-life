import {
  File,
  Image as ImageUpload,
  saveFile,
  uploadImage,
} from 'firebase/storage';
import {
  buildMessage as buildVideoMessage,
  uploadVideo,
  uploadVideoPoster,
} from './videoMessage';

import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { appConfig } from 'config';
import { buildMessage as buildFileMessage } from './fileMessage';
import { buildMessage as buildImageMessage } from './imageMessage';
import { buildMessage as buildTextMessage } from './textMessage';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';

/**
 * This function preserves the order of message attachments selected by the user
 * regardless of how long it takes to upload each attachment. Attachments are upload
 * in parallel via Promise.all. After all attachments have been uploaded then each
 * attachment is sent as its own message (first class citizen).
 *
 * Before attachment uploading begins the caller is provided a list of the "built"
 * messages with the local attachment uri's. This provides the caller the ability
 * to render attachments locally while uploading is in progress. The caller is notified
 * via a callback.
 */

export const sendMessages = async (
  messages: MessageType.PartialAny[],
  userProfile: UserProfile,
  group: Group,
  onBeforeSend: (messages: MessageType.Any[]) => void,
) => {
  let messagesBeingSent: MessageType.Any[] = [] as MessageType.Any[];
  let messageToPrepare: MessageType.Any | undefined;
  let textMessage: MessageType.Text | undefined;

  const uploadAttachmentsPromises: Promise<MessageType.Any>[] = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];

    if (m.type === 'file') {
      const fileMessage = buildFileMessage(m, userProfile);
      messageToPrepare = fileMessage;
      uploadAttachmentsPromises.push(
        new Promise<MessageType.File>((resolve, reject) => {
          saveFile({
            file: {
              mimeType: fileMessage.mimeType,
              uri: fileMessage.uri,
            } as File,
            storagePath: `${appConfig.storageFileChat}/${
              group.id || 'unknown-group'
            }/`,
            onSuccess: url => {
              // Update message with uri's from uploaded assets.
              fileMessage.uri = url;
              resolve(fileMessage);
            },
            onError: () => {
              // TODO: Message failed to send.
              reject();
            },
          });
        }),
      );
    } else if (m.type === 'image') {
      const imageMessage = buildImageMessage(m, userProfile);
      messageToPrepare = imageMessage;
      uploadAttachmentsPromises.push(
        new Promise<MessageType.Image>((resolve, reject) => {
          uploadImage({
            image: {
              mimeType: imageMessage.mimeType,
              uri: imageMessage.uri,
            } as ImageUpload,
            storagePath: `${appConfig.storageImageChat}/${
              group.id || 'unknown-group'
            }/`,
            onSuccess: url => {
              // Update message with uri's from uploaded assets.
              imageMessage.uri = url;
              resolve(imageMessage);
            },
            onError: () => {
              // TODO: Message failed to send.
              reject();
            },
          });
        }),
      );
    } else if (m.type === 'text') {
      // No upload. There can be only one text message per send.
      textMessage = buildTextMessage(m, userProfile);
    } else if (m.type === 'video') {
      const videoMessage = buildVideoMessage(m, userProfile);
      messageToPrepare = videoMessage;
      uploadAttachmentsPromises.push(
        new Promise<MessageType.Video>((resolve, reject) => {
          let posterUrl = '';
          let videoUrl = '';

          uploadVideo(videoMessage, group.id)
            .then(url => {
              videoUrl = url;
              return uploadVideoPoster(videoMessage, group.id);
            })
            .then(url => {
              posterUrl = url;
              // Update message with uri's from uploaded assets.
              videoMessage.posterUri = posterUrl;
              videoMessage.uri = videoUrl;
              resolve(videoMessage);
            })
            .catch(() => {
              // TODO: Message failed to send.
              reject();
            });
        }),
      );
    }

    if (messageToPrepare !== undefined) {
      (messageToPrepare as MessageType.Any).status = 'sending';
      messagesBeingSent = messagesBeingSent.concat(messageToPrepare);
      messageToPrepare = undefined;
    }
  }

  onBeforeSend(messagesBeingSent.concat(textMessage || []));

  // Upload all attachments.
  let preparedMessages: MessageType.Any[] = [];
  if (uploadAttachmentsPromises.length) {
    // Returns prepared messages in order of appearance at the input.
    preparedMessages = await Promise.all(uploadAttachmentsPromises);
  }

  // Add text message if present.
  preparedMessages.concat(textMessage || []);

  // Send all the messages in order.
  // We don't need to wait for each message to be sent.
  for (let i = 0; i < preparedMessages.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addChatMessage(preparedMessages[i], group.id!)
      .then(() => {
        if (i === preparedMessages.length) {
          // Store this message as the latest message posted to this group.
          updateGroupLatestMessageSnippet(
            preparedMessages[i],
            userProfile,
            group,
          );
        }
      })
      .catch(() => {
        // TODO: Message failed to send.
      });
  }
};
