import { ExtendedGroup, GroupNameSize } from 'types/group';

import { UserProfile } from 'types/user';
import { getUsers } from 'firebase/firestore';
import { hash } from 'lib/hash';
import lodash from 'lodash';
import { store } from 'store';

export const getGroupAvatarColor = (groupId: string, colors: string[]) =>
  colors[hash(groupId) % colors.length];

export const calculateGroupName = (
  group: ExtendedGroup,
  opts?: { type?: GroupNameSize },
) => {
  const type = opts?.type || 'long';

  if (group.name.length > 0) {
    group.extended = {
      ...group.extended,
      calculatedName: group.name,
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return group.extended.calculatedName!;
  }

  // Default group name if user profiles not specified.
  if (!group.extended?.groupUserProfiles) {
    group.extended = {
      ...group.extended,
      calculatedName: `${group.members.length} ${
        group.members.length === 1 ? 'Person' : 'People'
      }`,
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return group.extended.calculatedName!;
  }

  if (type === 'short') {
    group.extended.calculatedName = getGroupMembersShortStr(
      group.extended.groupUserProfiles,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return group.extended.calculatedName!;
  } else {
    group.extended.calculatedName = getGroupMembersLongStr(
      group.extended.groupUserProfiles,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return group.extended.calculatedName!;
  }
};

export const getGroupUserProfiles = async (memberIds: string[]) => {
  return (
    await getUsers({
      where: [{ fieldPath: 'id', opStr: 'in', value: memberIds }],
    })
  ).result;
};

// Returns a string of group members either one persons name or a count of people.
export const getGroupMembersShortStr = (userProfiles: UserProfile[]) => {
  const me = store.getState().user.profile;

  if (userProfiles.length > 2) {
    return `${userProfiles.length - 1} People`;
  } else if (userProfiles.length === 2) {
    userProfiles = userProfiles.filter(u => {
      return u.id !== me?.id;
    });
    return userProfiles[0]?.name || userProfiles[0]?.email || '1 Person';
  } else {
    // I am the only member of the group.
    return me?.name || me?.email || 'Me';
  }
};

// Returns a string of group members. Always a list of peoples names.
export const getGroupMembersLongStr = (userProfiles: UserProfile[]) => {
  const me = store.getState().user.profile;

  if (userProfiles.length > 2) {
    userProfiles = userProfiles
      .filter(u => {
        return u.id !== me?.id;
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
  } else if (userProfiles.length === 2) {
    userProfiles = userProfiles.filter(u => {
      return u.id !== me?.id;
    });
    return userProfiles[0]?.name || userProfiles[0]?.email || 'No Name';
  } else {
    // I am the only member of the group.
    return me?.name || me?.email || 'No Name';
  }
};
