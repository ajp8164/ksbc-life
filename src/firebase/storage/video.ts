import { log } from '@react-native-ajp-elements/core';
import storage from '@react-native-firebase/storage';
import { uuidv4 } from 'lib/uuid';

export type Video = {
  mimeType: string;
  uri: string;
};

/**
 * Upload a previously obtained video asset to storage. This function deletes the specified old
 * video if it specified.
 * @param args.video - the video description
 * @param args.storagePath - path in storage where the video will be stored
 * @param args.oldVideo - (optional) if it exists, this video will be deleted from storage
 * @param args.onSuccess - callback with a storage public url
 * @param args.onError - callback when an error occurs
 */
export const uploadVideo = async (args: {
  video: Video;
  storagePath: string;
  oldVideo?: string;
  onSuccess: (url: string) => void;
  onError: () => void;
}) => {
  const { video, storagePath, oldVideo, onSuccess, onError } = args;
  try {
    const videoType = video.mimeType.split('/')[1];
    const destFilename = `${storagePath}${uuidv4()}.${videoType}`;
    const sourceFilename = video.uri.replace('file://', '');
    const storageRef = storage().ref(destFilename);

    try {
      await storageRef.putFile(sourceFilename).catch(() => {
        // Need a handler here to swallow possible second throw inside putFile().
      });
      const url = await storageRef.getDownloadURL();
      // const thumbnailUrl = await saveThumbnail(video);
      oldVideo && (await deleteVideo({ filename: oldVideo, storagePath }));
      onSuccess(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      onError();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    log.error(`Video save failed: ${e.message}`);
    onError();
  }
};

/**
 * Delete a video from storage.
 * @param args.filename - the file to delete
 * @param args.storagePath - path in storage where the video is stored
 * @param args.onSuccess - callback when complete
 * @param args.onError - callback when an error occurs
 */
export const deleteVideo = async (args: {
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
        log.error(`Failed to delete video: ${e.message}`);
      }
      onError && onError();
    });
};
