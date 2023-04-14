import { cacheUserProfiles } from 'store/slices/cache';
import { dispatch } from 'store';
import { getUsers } from 'firebase/firestore/users';
import { log } from '@react-native-ajp-elements/core';

export const cacheUsers = async () => {
  const users = await getUsers();
  dispatch(cacheUserProfiles({ userProfiles: users.result }));
  log.debug(`Cached ${users.result.length} users from firestore`);
};
