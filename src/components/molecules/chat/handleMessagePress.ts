import { Linking } from 'react-native';
// import FileViewer from 'react-native-file-viewer';
import { MessageType } from '../../../react-native-chat-ui';

export const handleMessagePress = async (message: MessageType.Any) => {
  if (message.type === 'file') {
    Linking.openURL(message.uri);
    // await FileViewer.open(message.uri, {
    //   showOpenWithDialog: true,
    //   showAppsSuggestions: true,
    // });
  }
};
