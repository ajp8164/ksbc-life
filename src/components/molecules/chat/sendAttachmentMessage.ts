import { UserProfile } from 'types/user';
import { sendFileMessage } from './sendFileMessage';
import { sendImageMessage } from './sendImageMessage';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const useSendAttachment = () => {
  const { showActionSheetWithOptions } = useActionSheet();

  return (userProfile: UserProfile, threadId: string) => {
    return showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            sendImageMessage(userProfile, threadId);
            break;
          case 1:
            sendFileMessage(userProfile, threadId);
            break;
        }
      },
    );
  };
};
