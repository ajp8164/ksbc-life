import { Group, GroupNameSize } from 'types/group';

import { hash } from 'lib/hash';
import lodash from 'lodash';
import { store } from 'store';

export const getGroupAvatarColor = (groupId: string, colors: string[]) =>
  colors[hash(groupId) % colors.length];

// Returns a group name using cached user profiles.
export const getGroupName = (group: Group, opts?: { type?: GroupNameSize }) => {
  const type = opts?.type || 'long';

  if (group.name.length > 0) {
    return group.name;
  }
  if (type === 'short') {
    return getGroupMembersShortStr(group.members);
  } else {
    return getGroupMembersLongStr(group.members);
  }
};

// Returns a string of group members either one persons name or a count of people.
export const getGroupMembersShortStr = (members: string[]) => {
  members = lodash.uniq(members);
  const me = store.getState().user.profile;
  let userProfiles = store.getState().cache.userProfiles;

  if (members.length > 2) {
    return `${members.length - 1} People`;
  } else if (members.length === 2) {
    userProfiles = userProfiles.filter(u => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return members.includes(u.id!) && u.id !== me?.id;
    });
    return userProfiles[0]?.name || userProfiles[0]?.email || '1 Person';
  } else {
    // I am the only member of the group.
    return me?.name || me?.email || 'Me';
  }
};

// Returns a string of group members Always a list of peoples names.
export const getGroupMembersLongStr = (members: string[]) => {
  members = lodash.uniq(members);
  const me = store.getState().user.profile;
  let userProfiles = store.getState().cache.userProfiles;

  if (members.length > 2) {
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
          return `${name}, ${u.firstName || u.email}`;
        } else {
          return `${u.firstName || u.email}`;
        }
      },
      '',
    );
  } else if (members.length === 2) {
    userProfiles = userProfiles.filter(u => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return members.includes(u.id!) && u.id !== me?.id;
    });
    return userProfiles[0]?.name || userProfiles[0]?.email || 'No Name';
  } else {
    // I am the only member of the group.
    return me?.name || me?.email || 'No Name';
  }
};
