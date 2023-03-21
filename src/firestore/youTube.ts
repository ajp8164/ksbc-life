import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { YouTubeVideo } from 'types/youTube';
import { log } from '@react-native-ajp-elements/core';

export type YouTubeVideosQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  videos: YouTubeVideo[];
};

export const getVideos = (
  limit: number,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): Promise<YouTubeVideosQueryResult> => {
  let query = firestore()
    .collection('YouTubeVideos')
    .orderBy('snippet.publishedAt', 'desc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }
  return (
    query
      .limit(limit || 1) // Must be positive value
      .get()
      .then(querySnapshot => {
        const videos: YouTubeVideo[] = [];
        querySnapshot.forEach(doc => {
          const video = <YouTubeVideo>doc.data();
          videos.push(video);
        });
        return {
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
          videos,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get YouTube video documents: ${e.message}`);
        throw e;
      })
  );
};

export const addVideo = (video: YouTubeVideo): Promise<YouTubeVideo> => {
  return (
    firestore()
      .collection('YouTubeVideos')
      .add(video)
      .then(() => {
        return video;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add YouTube video document: ${e.message}`);
        throw e;
      })
  );
};
