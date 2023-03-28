import { log } from '@react-native-ajp-elements/core';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { YouTubeVideoId } from 'types/youTube';

export type QueryResult<T> = {
  allLoaded: boolean;
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  result: T[];
};
export type QueryOrderBy = {
  fieldPath: string | number | FirebaseFirestoreTypes.FieldPath;
  directionStr?: 'asc' | 'desc' | undefined;
};

export type QueryWhere = {
  fieldPath: string | number | FirebaseFirestoreTypes.FieldPath;
  opStr: FirebaseFirestoreTypes.WhereFilterOp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export const getDocument = <T>(
  collectionPath: string,
  id: string,
): Promise<T | undefined> => {
  return (
    firestore()
      .collection(collectionPath)
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const result = {
            ...documentSnapshot.data(),
            id,
          };
          return result as T;
        } else {
          return;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get ${collectionPath} document: ${e.message}`);
        throw e;
      })
  );
};

export const getDocuments = <
  T extends { id?: string | YouTubeVideoId | undefined },
>(
  collectionPath: string,
  opts?: {
    orderBy?: QueryOrderBy;
    limit?: number;
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    skipIdMap?: boolean;
  },
): Promise<QueryResult<T>> => {
  const { orderBy, limit = 1, lastDocument, skipIdMap } = opts || {};
  let query = firestore().collection(collectionPath);

  if (orderBy) {
    query = query.orderBy(
      orderBy.fieldPath,
      orderBy.directionStr,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  if (lastDocument) {
    query = query.startAfter(
      lastDocument,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  return (
    query
      // Limit must be positive value. Load one more than requested to detect end of list.
      .limit(limit + 1 || 2)
      .get()
      .then(querySnapshot => {
        const result: T[] = [];
        querySnapshot.forEach((doc, index) => {
          if (index < limit) {
            const data = <T>doc.data();
            !skipIdMap && (data.id = doc.id);
            result.push(data);
          }
        });
        return <QueryResult<T>>{
          allLoaded: querySnapshot.docs.length < limit + 1,
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 2],
          result,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get ${collectionPath} documents: ${e.message}`);
        throw e;
      })
  );
};

export const getDocumentCount = (collectionPath: string): Promise<number> => {
  return firestore()
    .collection(collectionPath)
    .count()
    .get()
    .then(snapshot => {
      return snapshot.data().count;
    });
};

export const collectionChangeListener = (
  collectionPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
  opts: {
    lastDocument?: FirebaseFirestoreTypes.DocumentData;
    limit?: number;
    orderBy?: QueryOrderBy;
    where?: QueryWhere;
  },
): (() => void) => {
  const { lastDocument, limit, orderBy, where } = opts;

  let query = firestore().collection(collectionPath);
  if (orderBy) {
    query = query.orderBy(
      orderBy.fieldPath,
      orderBy.directionStr,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  if (where) {
    query = query.where(
      where.fieldPath,
      where.opStr,
      where.value,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  if (limit) {
    query = query.limit(
      limit,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }

  if (lastDocument) {
    query = query.startAfter(
      lastDocument,
    ) as FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return query.onSnapshot(handler, (e: any) => {
    log.error(
      `Failed onSnapshot for ${collectionPath} collection: ${e.message}`,
    );
  });
};

export const documentChangeListener = (
  collectionPath: string,
  documentPath: string,
  handler: (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void,
): (() => void) => {
  return (
    firestore()
      .collection(collectionPath)
      .doc(documentPath)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .onSnapshot(handler, (e: any) => {
        if (!e.message.includes('firestore/permission-denied')) {
          log.error(
            `Failed onSnapshot for ${collectionPath}.${documentPath} document: ${e.message}`,
          );
        }
      })
  );
};
