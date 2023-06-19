import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { createAuthor } from './createAuthor';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendTextMessage = (
  textMessage: MessageType.PartialText,
  userProfile: UserProfile,
  group: Group,
) => {
  const message = buildMessage(textMessage, userProfile);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  addChatMessage(message, group.id!)
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

const buildMessage = (
  message: MessageType.PartialText,
  userProfile: UserProfile,
) => {
  return {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: message.metadata || {},
    previewData: message.previewData || {},
    text: message.text,
    type: 'text',
  } as MessageType.Text;
};
