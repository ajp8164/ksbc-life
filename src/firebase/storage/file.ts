import { log } from '@react-native-ajp-elements/core';
import storage from '@react-native-firebase/storage';
import { uuidv4 } from 'lib/uuid';

export type File = {
  mimeType: string;
  uri: string;
};

/**
 * Save a previously obtained file asset to storage. This function deletes the specified old
 * file if specified.
 * @param args.file - the local file description
 * @param args.storagePath - path in storage where the file will be stored
 * @param args.oldFile - (optional) if it exists, this file will be deleted from storage
 * @param args.onSuccess - callback with a storage public url
 * @param args.onError - callback when an error occurs
 */
export const saveFile = async (args: {
  file: File;
  storagePath: string;
  oldFile?: string;
  onSuccess: (url: string) => void;
  onError: () => void;
}) => {
  const { file, storagePath, oldFile, onSuccess, onError } = args;
  try {
    const fileType = file.mimeType.split('/')[1];
    const destFilename = `${storagePath}${uuidv4()}.${fileType}`;
    const sourceFilename = file.uri.replace('file://', '');
    const storageRef = storage().ref(destFilename);

    try {
      await storageRef.putFile(sourceFilename).catch(() => {
        // Need a handler here to swallow possible second throw inside putFile().
      });
      const url = await storageRef.getDownloadURL();
      oldFile && (await deleteFile({ filename: oldFile, storagePath }));
      onSuccess(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      onError();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`File save failed: ${e.message}`);
    onError();
  }
};

/**
 * Delete a file from storage.
 * @param args.filename - the file to delete
 * @param args.storagePath - path in storage where the file is stored
 * @param args.onSuccess - callback when complete
 * @param args.onError - callback when an error occurs
 */
export const deleteFile = async (args: {
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
        log.error(`Failed to delete file: ${e.message}`);
      }
      onError && onError();
    });
};
