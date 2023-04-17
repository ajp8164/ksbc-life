import { Group } from 'types/group';
import { hash } from 'lib/hash';
import lodash from 'lodash';
import { store } from 'store';

export const getGroupAvatarColor = (groupId: string, colors: string[]) =>
  colors[hash(groupId) % colors.length];

// Returns a group name using cached user profiles.
export const getGroupName = (group: Group) => {
  if (group.name.length > 0) {
    return group.name;
  }
  return getGroupMembersStr(group.members);
};

// Returns a string of group member names.
export const getGroupMembersStr = (members: string[]) => {
  const me = store.getState().user.profile;
  let userProfiles = store.getState().cache.userProfiles;
  userProfiles = userProfiles
    .filter(u => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return members.includes(u.id!) && u.id !== me?.id;
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
