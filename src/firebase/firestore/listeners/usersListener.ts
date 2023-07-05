import { dispatch, store } from 'store';

import { UserProfile } from 'types/user';
import { cacheUserProfiles } from 'store/slices/cache';
import { log } from '@react-native-ajp-elements/core';
import { updateUserProfile } from 'store/slices/user';
import { usersCollectionChangeListener } from 'firebase/firestore';

export const addUsersCollectionListener = async () => {
  const me = store.getState().user.profile;

  usersCollectionChangeListener(snapshot => {
    if (snapshot.docChanges().length === 0) return;

    const users: UserProfile[] = [];
    snapshot.docs.forEach(d => {
      const u = { ...d.data(), id: d.id } as UserProfile;
      users.push(u);

      // We update our own user profile during cache update. This catches the
      // case when we update our own profile via firestore updateUser(); keeps
      // the redux store in sync during the current app session.
      // Maintain a separate instance of our own profile has a performance benefit since
      // we don't need to search the cache each time we need to read our own profile.
      if (me && u.id === me.id) {
        dispatch(updateUserProfile({ userProfile: u }));
      }
    });
    dispatch(cacheUserProfiles({ userProfiles: users }));
    log.debug(`Cached ${users.length} users from firestore`);
  });
};
