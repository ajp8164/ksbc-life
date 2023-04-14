import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import { hash } from 'lib/hash';
import lodash from 'lodash';
import { store } from 'store';

export const getGroupAvatarColor = (groupId: string, colors: string[]) =>
  colors[hash(groupId) % colors.length];

// Creates an initial group name using a list of user profiles.
// This is useful at the point of group creation.
export const createGroupName = (userProfiles: UserProfile[]) => {
  return lodash.reduce(
    userProfiles.sort((a, b) => {
      return a.firstName < b.firstName ? -1 : 1;
    }),
    (name, u) => {
      if (name.length > 0) {
        return `${name}, ${u.firstName}`;
      } else {
        return `${u.firstName}`;
      }
    },
    '',
  );
};

// Returns a group name using cached user profiles.
export const getGroupName = (group: Group) => {
  if (group.name.length > 0) {
    return group.name;
  }

  let userProfiles = store.getState().cache.userProfiles;
  userProfiles = userProfiles
    .filter(u => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return group.members.includes(u.id!);
    })
    .sort((a, b) => {
      return a.firstName < b.firstName ? -1 : 1;
    });

  return lodash.reduce(
    userProfiles,
    (name, u) => {
      if (name.length > 0) {
        return `${name}, ${u.firstName}`;
      } else {
        return `${u.firstName}`;
      }
    },
    '',
  );
};
