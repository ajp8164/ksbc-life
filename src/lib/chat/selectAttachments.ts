import { Attachment, MessageType } from '@flyerhq/react-native-chat-ui';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { selectImage } from '@react-native-ajp-elements/ui';
import { useActionSheet } from '@expo/react-native-action-sheet';

export const useSelectAttachments = () => {
  const { showActionSheetWithOptions } = useActionSheet();

  return (): Promise<Attachment[]> => {
    // Images and videos
    const chooseFromCameraRoll = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        selectImage({
          multiSelect: true,
          onSuccess: async assets => {
            const selections = [];
            for (let i = 0; i < assets.length; i++) {
              const asset = assets[i];
              if (asset.type?.includes('video')) {
                const posterUri =
                  asset.uri && (await createVideoPoster(asset.uri));
                selections.push({
                  duration: asset.duration,
                  height: asset.height,
                  metadata: {},
                  mimeType: asset.type,
                  name: asset.fileName,
                  posterUri,
                  size: asset.fileSize,
                  type: 'video',
                  uri: asset.uri,
                  width: asset.width,
                } as MessageType.PartialVideo);
              } else {
                selections.push({
                  height: asset.height,
                  metadata: {},
                  mimeType: asset.type,
                  name: asset.fileName,
                  size: asset.fileSize,
                  type: 'image',
                  uri: asset.uri,
                  width: asset.width,
                } as MessageType.PartialImage);
              }
            }
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
            resolve(selections as Attachment[]);
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((_e: any) => {
            reject([] as Attachment[]);
          });
      });
    };

    const createVideoPoster = async (videoUri: string) => {
      const filename = videoUri.split('/').pop();
      const posterUri = `${RNFS.DocumentDirectoryPath}/${filename}.png`;
      return await FFmpegKit.execute(
        `-y -ss 00:00:01.000 -i ${videoUri} -vframes 1 ${posterUri}`,
      ).then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          return `file://${posterUri}`;
          // SUCCESS
        } else if (ReturnCode.isCancel(returnCode)) {
          // CANCEL
        } else {
          // ERROR
        }
      });
    };

    return new Promise<Attachment[]>((resolve, reject) => {
      showActionSheetWithOptions(
        {
          options: ['Camera Roll', 'File', 'Cancel'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              resolve(chooseFromCameraRoll());
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
