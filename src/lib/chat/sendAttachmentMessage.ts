import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import { sendFileMessage } from './sendFileMessage';
import { sendImageMessage } from './sendImageMessage';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const useSendAttachment = () => {
  const { showActionSheetWithOptions } = useActionSheet();

  return (userProfile: UserProfile, group: Group) => {
    return showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            group.id && sendImageMessage(userProfile, group);
            break;
          case 1:
            group.id && sendFileMessage(userProfile, group);
            break;
        }
      },
    );
  };
};
