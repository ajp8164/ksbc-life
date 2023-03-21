import {
  QueryOrderBy,
  QueryResult,
  collectionChangeListener,
  getDocument,
  getDocuments,
} from 'firestore/utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { SermonVideo } from 'types/sermon';

export const getSermonVideo = (
  id: string,
): Promise<SermonVideo | undefined> => {
  return getDocument('SermonVideos', id);
};

export const getSermonVideos = (opts?: {
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
  limit?: number;
  orderBy?: QueryOrderBy;
}): Promise<QueryResult<SermonVideo>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'snippet.publishedAt', directionStr: 'desc' },
  } = opts || {};
  return getDocuments('SermonVideos', {
    orderBy,
    limit,
    lastDocument,
    skipIdMap: true,
  });
};

export const addSermonVideos = (videos: SermonVideo[]): Promise<void> => {
  const batch = firestore().batch();

  // Set the video document id to the YouTube video id.
  videos.forEach(video => {
    const doc = firestore().collection('SermonVideos').doc(video.id.videoId);
    batch.set(doc, video);
  });
  return batch.commit();
};

export const sermonVideosCollectionChangeListener = (
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
  },
): (() => void) => {
  const {
    lastDocument,
    limit,
    orderBy = { fieldPath: 'snippet.publishedAt', directionStr: 'desc' },
  } = opts;
  return collectionChangeListener('SermonVideos', handler, {
    lastDocument,
    limit,
    orderBy,
  });
};
