import { Linking } from 'react-native';
import { MessageType } from '@flyerhq/react-native-chat-ui';

// import FileViewer from 'react-native-file-viewer';

export const handleMessagePress = async (message: MessageType.Any) => {
  if (message.type === 'file') {
    Linking.openURL(message.uri);
    // await FileViewer.open(message.uri, {
    //   showOpenWithDialog: true,
    //   showAppsSuggestions: true,
    // });
  }
};
