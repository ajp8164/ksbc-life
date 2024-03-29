import {
  CollectionChangeListenerOptions,
  QueryOrderBy,
  QueryResult,
  QueryWhere,
  collectionChangeListener,
  documentChangeListener,
  getDocument,
  getDocuments,
} from '.';
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
  where?: QueryWhere[];
}): Promise<QueryResult<SermonVideo>> => {
  const {
    lastDocument,
    limit = 10,
    orderBy = { fieldPath: 'snippet.publishedAt', directionStr: 'desc' },
    where,
  } = opts || {};
  return getDocuments('SermonVideos', {
    orderBy,
    limit,
    lastDocument,
    where,
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
  opts?: Omit<CollectionChangeListenerOptions, 'subCollection'>,
): (() => void) => {
  opts = {
    orderBy: { fieldPath: 'snippet.publishedAt', directionStr: 'desc' },
    ...opts,
  } as CollectionChangeListenerOptions;
  return collectionChangeListener('SermonVideos', handler, opts);
};

export const sermonVideosDocumentChangeListener = (
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return documentChangeListener('SermonVideos', documentPath, handler);
};
