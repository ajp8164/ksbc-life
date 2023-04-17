import { UserProfile } from 'types/user';
import { cacheUserProfiles } from 'store/slices/cache';
import { dispatch } from 'store';
import { log } from '@react-native-ajp-elements/core';
import { usersCollectionChangeListener } from 'firebase/firestore/users';

export const cacheUsers = async () => {
  usersCollectionChangeListener(snapshot => {
    const users: UserProfile[] = [];
    snapshot.docs.forEach(d => {
      users.push({ ...d.data(), id: d.id } as UserProfile);
    });
    dispatch(cacheUserProfiles({ userProfiles: users }));
    log.debug(`Cached ${users.length} users from firestore`);
  });
};
