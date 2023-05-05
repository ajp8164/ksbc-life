import { Group } from 'types/group';
// import { MessageType } from '@flyerhq/react-native-chat-ui';
import { MessageType } from '../../../react-native-chat-ui/src';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firebase/firestore';
import { createAuthor } from './createAuthor';
import { updateGroupLatestMessageSnippet } from './updateGroupLatestMessageSnippet';
import { uuidv4 } from 'lib/uuid';

export const sendTextMessage = async (
  message: MessageType.PartialText,
  userProfile: UserProfile,
  group: Group,
) => {
  const textMessage: MessageType.Text = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    metadata: message.metadata || {},
    previewData: message.previewData || {},
    text: message.text,
    type: 'text',
  };
  group.id && (await addChatMessage(textMessage, group.id));

  // Store this message as the latest message posted to this group.
  updateGroupLatestMessageSnippet(message, userProfile, group);
};
