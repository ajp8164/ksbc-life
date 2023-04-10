import FileViewer from 'react-native-file-viewer';
import { MessageType } from '../../../react-native-chat-ui';

export const handleMessagePress = async (message: MessageType.Any) => {
  if (message.type === 'file') {
    await FileViewer.open(message.uri, { showOpenWithDialog: true });
  }
};
