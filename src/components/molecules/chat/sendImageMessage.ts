import { MessageType } from '../../../react-native-chat-ui';
import { UserProfile } from 'types/user';
import { addChatMessage } from 'firestore/chatMessages';
import { createAuthor } from './createAuthor';
import { launchImageLibrary } from 'react-native-image-picker';
import { uuidv4 } from 'lib/uuid';

export const sendImageMessage = (
  userProfile: UserProfile,
  threadId: string,
) => {
  launchImageLibrary(
    {
      includeBase64: true,
      maxWidth: 1440,
      mediaType: 'photo',
      quality: 0.7,
    },
    ({ assets }) => {
      const response = assets?.[0];

      if (response?.base64) {
        const imageMessage: MessageType.Image = {
          id: uuidv4(),
          author: createAuthor(userProfile),
          height: response.height,
          name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
          size: response.fileSize ?? 0,
          type: 'image',
          uri: `data:image/*;base64,${response.base64}`,
          width: response.width,
        };
        threadId && addChatMessage(imageMessage, threadId);
      }
    },
  );
};
