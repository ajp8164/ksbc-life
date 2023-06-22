import { RNFileCache } from 'react-native-file-cache';
import { log } from '@react-native-ajp-elements/core';

export const resolveUrl = (url: string, callback: (url: string) => void) => {
  if (!RNFileCache.isInternetURL(url)) {
    return callback(url);
  }

  if (RNFileCache.exists(url)) {
    try {
      const existingPath = RNFileCache.getPath(url);
      if (!existingPath) {
        throw new Error('URL resolved path is undefined after get path.');
      }
      return callback(existingPath);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      log.warn(`Existing URL resolve failed: ${e.message}`);
    }
  } else {
    RNFileCache.download({ url })
      .then(file => {
        if (!file.path) {
          throw new Error('URL resolved path is undefined after download.');
        }
        return callback(file?.path);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e): any => {
        log.warn(`Download URL resolve failed: ${e.message}`);
      });
  }
};
