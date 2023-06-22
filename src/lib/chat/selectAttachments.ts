import { Attachment, MessageType } from '@flyerhq/react-native-chat-ui';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import {
  MediaAsset,
  MediaCapture,
  selectImage,
} from '@react-native-ajp-elements/ui';

import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { log } from '@react-native-ajp-elements/core';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCamera } from 'lib/camera';

export const useSelectAttachments = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const camera = useCamera();

  return (): Promise<Attachment[]> => {
    // Images and videos
    const chooseFromCameraRoll = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, reject) => {
        selectImage({
          multiSelect: true,
          onSuccess: async assets => {
            const attachments = await createAssetAttachments(assets);
            resolve(attachments);
          },
          onError: () => {
            reject([] as Attachment[]);
          },
        });
      });
    };

    // Take photo or video using camera
    const takePhoto = (): Promise<Attachment[]> => {
      return new Promise<Attachment[]>((resolve, _reject) => {
        camera.presentCameraModal({
          onCapture: async (capture: MediaCapture) => {
            const attachment = await createCaptureAttachment(capture);
            resolve([attachment]);
          },
          onSelect: async (assets: MediaAsset[]) => {
            const attachments = await createAssetAttachments(assets);
            resolve(attachments);
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

    const createAssetAttachments = async (
      assets: MediaAsset[],
    ): Promise<Attachment[]> => {
      const selections = [];
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (asset.type?.includes('video')) {
          const posterUri = asset.uri && (await createVideoPoster(asset.uri));
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
      return selections;
    };

    const createCaptureAttachment = async (
      capture: MediaCapture,
    ): Promise<Attachment> => {
      let attachment: Attachment;
      if (capture.type?.includes('video')) {
        const posterUri =
          capture.media.path && (await createVideoPoster(capture.media.path));
        attachment = {
          duration: capture.media.duration,
          height: capture.media.height,
          metadata: {},
          mimeType: capture.mimeType,
          name: capture.media.path.split('/').pop(),
          posterUri,
          size: capture.media.duration,
          type: 'video',
          uri: capture.media.path,
          width: capture.media.width,
        } as MessageType.PartialVideo;
      } else {
        attachment = {
          height: capture.media.height,
          metadata: {},
          mimeType: capture.mimeType,
          name: capture.media.path.split('/').pop(),
          size: capture.media.size,
          type: 'image',
          uri: capture.media.path,
          width: capture.media.width,
        } as MessageType.PartialImage;
      }
      return attachment;
    };

    const createVideoPoster = async (videoUri: string) => {
      const filename = videoUri.split('/').pop();
      const posterUri = `${RNFS.CachesDirectoryPath}/${filename}.png`;
      log.debug('Creating video poster...');
      return await FFmpegKit.execute(
        `-loglevel quiet -y -i ${videoUri} -frames:v 1 ${posterUri}`,
      ).then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          log.debug('Done creating video poster');
          return `file://${posterUri}`;
        } else if (ReturnCode.isCancel(returnCode)) {
          // Canceled
        } else {
          log.debug('Error creating video poster');
          // Error
        }
      });
    };

    return new Promise<Attachment[]>((resolve, reject) => {
      showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose Photos', 'Choose Files', 'Cancel'],
          cancelButtonIndex: 3,
        },
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              resolve(takePhoto());
              break;
            case 1:
              resolve(chooseFromCameraRoll());
              break;
            case 2:
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
