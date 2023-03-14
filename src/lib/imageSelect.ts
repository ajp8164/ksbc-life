import * as ImagePicker from 'react-native-image-picker';

import { log } from '@react-native-ajp-elements/core';
import storage from '@react-native-firebase/storage';
import { uuidv4 } from 'lib/uuid';

/**
 * Select an image locally and respond with an image asset object.
 * @param args.onSuccess callback with an image asset
 * @param args.onError callback when an error occurs
 */
export const selectImage = (args: {
  onSuccess: (imageAsset: ImagePicker.Asset) => void;
  onError: () => void;
}) => {
  const { onSuccess, onError } = args;
  ImagePicker.launchImageLibrary(
    {
      mediaType: 'photo',
      selectionLimit: 1,
    },
    async response => {
      try {
        if (response.assets && response.assets[0]?.uri) {
          onSuccess(response.assets[0]);
        } else if (response.errorCode) {
          const msg = `Image select failed: ${response.errorCode} - ${response.errorMessage}`;
          log.error(msg);
          throw msg;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        onError();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).catch((e: any) => {
    log.error(e.message);
    onError();
  });
};

/**
 * Save a previously obtained image asset (see selectImage()) to storage. This function
 * deletes the specified old image if it exists.
 * @param args.imageAsset - the image asset obtained from selectImage()
 * @param args.storagePath - path in storage where the image will be stored
 * @param args.oldImage - (optional) if it exists, this image will be deleted from storage
 * @param args.onSuccess - callback with a storage public url
 * @param args.onError - callback when an error occurs
 */
export const saveImage = async (args: {
  imageAsset: ImagePicker.Asset;
  storagePath: string;
  oldImage?: string;
  onSuccess: (url: string) => void;
  onError: () => void;
}) => {
  const { imageAsset, storagePath, oldImage, onSuccess, onError } = args;
  try {
    if (imageAsset?.type && imageAsset?.uri) {
      const imageType = imageAsset.type.split('/')[1];
      const destFilename = `${storagePath}${uuidv4()}.${imageType}`;
      const sourceFilename = imageAsset.uri.replace('file://', '');
      const storageRef = storage().ref(destFilename);

      try {
        await storageRef.putFile(sourceFilename).catch(() => {
          // Need a handler here to swallow possible second throw inside putFile().
        });
        const url = await storageRef.getDownloadURL();
        oldImage && (await deleteImage({ filename: oldImage, storagePath }));
        onSuccess(url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        onError();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`Image save failed: ${e.message}`);
    onError();
  }
};

/**
 * Delete an image from storage.
 * @param args.filename - the file to delete
 * @param args.storagePath - path in storage where the image is stored
 * @param args.onSuccess - callback when complete
 * @param args.onError - callback when an error occurs
 */
export const deleteImage = async (args: {
  filename: string;
  storagePath: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { filename, onError, onSuccess, storagePath } = args;
  const filenameRef = `${storagePath}${
    filename.replace(/%2F/g, '/').split('/').pop()?.split('#')[0].split('?')[0]
  }`;
  await storage()
    .ref(filenameRef)
    .delete()
    .then(() => onSuccess && onSuccess())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      if (!e.message.includes('storage/object-not-found')) {
        log.error(`Failed to delete image: ${e.message}`);
      }
      onError && onError();
    });
};
