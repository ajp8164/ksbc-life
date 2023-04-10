import DocumentPicker from 'react-native-document-picker';
import { MessageType } from '../../../react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firestore/chatMessages';
import { createAuthor } from './createAuthor';
import { uuidv4 } from 'lib/uuid';

export const sendFileMessage = async (
  userProfile: UserProfile,
  threadId: string,
) => {
  const response = await DocumentPicker.pickSingle({
    type: [DocumentPicker.types.allFiles],
  });
  const fileMessage: MessageType.File = {
    id: uuidv4(),
    author: createAuthor(userProfile),
    mimeType: response.type ?? undefined,
    name: response.name || 'temp',
    size: response.size ?? 0,
    type: 'file',
    uri: response.uri,
  };
  addChatMessage(fileMessage, threadId);
};
