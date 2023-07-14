import { dispatch, store } from 'store';

import { UserProfile } from 'types/user';
import { updateUserProfile } from 'store/slices/user';
import { usersDocumentChangeListener } from 'firebase/firestore';

export const listenForChangesToMyUserProfile = () => {
  const me = store.getState().user.profile;
  if (!me?.id) return;

  usersDocumentChangeListener(me.id, snapshot => {
    dispatch(
      updateUserProfile({ userProfile: snapshot.data() as UserProfile }),
    );
  });
};
