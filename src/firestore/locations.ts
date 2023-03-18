import { Location } from 'types/location';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export type LocationsQueryResult = {
  lastDocument: FirebaseFirestoreTypes.DocumentData;
  locations: Location[];
};

export const getLocation = (id: string): Promise<Location | undefined> => {
  return (
    firestore()
      .collection('Locations')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const location = {
            ...documentSnapshot.data(),
            id,
          };
          return location as Location;
        } else {
          return;
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get location document: ${e.message}`);
        throw e;
      })
  );
};

export const getLocations = (
  limit: number,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): Promise<LocationsQueryResult> => {
  let query = firestore().collection('Locations').orderBy('name', 'asc');

  if (lastDocument) {
    query = query.startAfter(lastDocument);
  }

  return (
    query
      .limit(limit || 1) // Must be positive value
      .get()
      .then(querySnapshot => {
        const locations: Location[] = [];
        querySnapshot.forEach(doc => {
          const location = <Location>doc.data();
          location.id = doc.id;
          locations.push(location);
        });
        return {
          lastDocument: querySnapshot.docs[querySnapshot.docs.length - 1],
          locations,
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to get location documents: ${e.message}`);
        throw e;
      })
  );
};

export const addLocation = (location: Location): Promise<Location> => {
  return (
    firestore()
      .collection('Locations')
      .add(location)
      .then(documentSnapshot => {
        location.id = documentSnapshot.id;
        return location;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to add location document: ${e.message}`);
        throw e;
      })
  );
};

export const updateLocation = (location: Location): Promise<Location> => {
  const id = location.id;
  delete location.id; // Not storing the doc id in the object.
  return (
    firestore()
      .collection('Locations')
      .doc(id)
      .update(location)
      .then(() => {
        return location;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.message.includes('firestore/not-found')) {
          return addLocation(location);
        }
        log.error(`Failed to update location document: ${e.message}`);
        throw e;
      })
  );
};

export const deleteLocation = (id: string): Promise<void> => {
  return (
    firestore()
      .collection('Locations')
      .doc(id)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        log.error(`Failed to delete location document: ${e.message}`);
        throw e;
      })
  );
};
