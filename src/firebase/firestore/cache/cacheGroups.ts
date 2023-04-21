import { Group } from 'types/group';
import { cacheGroups as cache } from 'store/slices/cache';
import { dispatch } from 'store';
import { groupsCollectionChangeListener } from 'firebase/firestore';
import { log } from '@react-native-ajp-elements/core';

export const cacheGroups = async () => {
  groupsCollectionChangeListener(snapshot => {
    const groups: Group[] = [];
    snapshot.docs.forEach(d => {
      groups.push({ ...d.data(), id: d.id } as Group);
    });
    dispatch(cache({ groups }));
    log.debug(`Cached ${groups.length} groups from firestore`);
  });
};
