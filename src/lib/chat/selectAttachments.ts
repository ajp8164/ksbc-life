import DocumentPicker from 'react-native-document-picker';

import {
  Attachment,
  MessageType,
} from '../../../react-native-chat-ui/src/types';

import { selectImage } from '@react-native-ajp-elements/ui';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const useSelectAttachments = () => {
  const { showActionSheetWithOptions } = useActionSheet();

  return (): Promise<Attachment[]> => {
    // Images
    const chooseImages = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        selectImage({
          multiSelect: true,
          onSuccess: async imageAssets => {
            const selections = imageAssets.map(ia => {
              return {
                height: ia.height,
                metadata: {},
                mimeType: ia.type,
                name: ia.fileName,
                size: ia.fileSize,
                type: 'image',
                uri: ia.uri,
                width: ia.width,
              } as MessageType.PartialImage;
            });
            resolve(selections as Attachment[]);
          },
          onError: () => {
            reject([] as Attachment[]);
          },
        });
      });
    };

    // Files
    const chooseFiles = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.allFiles],
        })
          .then(files => {
            const selections = files.map(f => {
              return {
                metadata: {},
                mimeType: f.type,
                name: f.name,
                size: f.size,
                type: 'file',
                uri: f.uri,
              } as MessageType.PartialFile;
            });
            resolve(selections);
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((_e: any) => {
            reject([] as Attachment[]);
          });
      });
    };

    return new Promise<Attachment[]>((resolve, reject) => {
      showActionSheetWithOptions(
        {
          options: ['Photo', 'File', 'Cancel'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              resolve(chooseImages());
              break;
            case 1:
              resolve(chooseFiles());
              break;
            default:
              reject([] as Attachment[]);
          }
        },
      );
    });
  };
};
