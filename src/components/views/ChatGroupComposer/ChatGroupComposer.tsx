import Animated, { SlideOutUp } from 'react-native-reanimated';
import { AppTheme, useTheme } from 'theme';
import { ChatGroupComposerMethods, ChatGroupComposerProps } from './types';
import { FlatList, ListRenderItem, Text } from 'react-native';
import { SearchCriteria, SearchScope } from 'types/chat';
import { addGroup, getUsers, updateUser } from 'firebase/firestore';
import { getGroupAvatarColor, getGroupMembersLongStr } from 'lib/group';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { Group } from 'types/group';
import { Incubator } from 'react-native-ui-lib';
import { ListItem } from '@react-native-ajp-elements/ui';
import React from 'react';
import { UserPickerModal } from 'components/modals/UserPickerModal';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';

const initialSearchCriteria = { text: '', scope: SearchScope.Username };
const minimumRequiredCharsForSearch = 2;

type ChatGroupComposer = ChatGroupComposerMethods;

const ChatGroupComposer = React.forwardRef<
  ChatGroupComposer,
  ChatGroupComposerProps
>((props, ref) => {
  const { myGroups, myUserProfile, onComposerChanged, visible } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(
    initialSearchCriteria,
  );
  const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [userSearchSet, setUserSearchSet] = useState<UserProfile[]>([]);
  const userPickerModalRef = useRef<UserPickerModal>(null);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    createGroup,
    presentUserPicker,
  }));

  useEffect(() => {
    // Get the list of users for search.
    getUsers().then(users => {
      setUserSearchSet(users.result);
    });
  }, []);

  // Filter users while typing.
  useEffect(() => {
    // On initial entry to search (user tapped search input)...
    // clear filtered data so only filtered results will display when search text is set.
    if (searchFocused && searchCriteria.text === '') {
      setFilteredUsers([]);
    }
  }, [searchFocused, searchCriteria]);

  useEffect(() => {
    if (!visible) {
      setAddedUsers([]);
    }
  }, [visible]);

  // Select and set/unset a group (shows messages) while adding users during composing a group.
  useEffect(() => {
    const added = addedUsers.map(u => {
      return u.id;
    });

    if (added.length) {
      const group = myGroups?.find(g => {
        // This test requires my user id since stored members includes me.
        return lodash.isEqual(
          lodash.sortBy(added.concat(myUserProfile?.id)),
          lodash.sortBy(g.members),
        );
      });

      if (group) {
        onComposerChanged(group, addedUsers);
      } else {
        onComposerChanged(undefined, addedUsers);
      }
    } else {
      onComposerChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedUsers]);

  const addedUserChips = () => {
    return addedUsers.map(u => {
      return {
        label: u.name || u.email,
        labelStyle: theme.styles.textSmall,
        dismissColor: theme.colors.text,
        dismissIconStyle: s.userChipDismissIcon,
        onDismiss: () => {
          const current = ([] as UserProfile[]).concat(addedUsers);
          lodash.remove(current, u);
          setAddedUsers(current);
        },
      } as Incubator.ChipsInputChipProps;
    });
  };

  const createGroup = async (): Promise<Group> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const members = [myUserProfile!].concat(addedUsers);
    // Uniq allows for a group of one - chat with myself.
    const memberIds = lodash.uniq(
      members.map(u => {
        return u.id;
      }),
    ) as string[];

    const groupName = getGroupMembersLongStr(members);

    const newGroup = {
      createdBy: myUserProfile?.id,
      name: groupName,
      type: 'private',
      members: memberIds,
      leaders: [myUserProfile?.id],
      photoUrl: '',
      avatar: {
        color: getGroupAvatarColor(`${groupName}`, theme.colors.avatarColors),
        title: '',
      },
    } as Group;

    const addedGroup = await addGroup(newGroup);

    // Add group membership to each user (including myself).
    members.forEach(u => {
      if (addedGroup.id) {
        u.groups = u.groups.concat(addedGroup.id);
        updateUser(u);
      }
    });

    return addedGroup;
  };

  const presentUserPicker = () => {
    userPickerModalRef.current?.present();
  };

  const searchFilter = async ({ text, scope }: SearchCriteria) => {
    setSearchCriteria({ text, scope });
    if (text.length >= minimumRequiredCharsForSearch) {
      if (scope === SearchScope.Username) {
        //Case insensitive match.
        const usersByFirstName =
          lodash.filter(userSearchSet, u =>
            u.firstName.toLowerCase().includes(text.toLowerCase()),
          ) || [];
        const usersByLastName =
          lodash.filter(userSearchSet, u =>
            u.lastName.toLowerCase().includes(text.toLowerCase()),
          ) || [];
        const usersByEmail =
          lodash.filter(userSearchSet, u =>
            u.email.toLowerCase().includes(text.toLowerCase()),
          ) || [];

        // Ensure no duplicates in the result.
        const searchResult = lodash.uniqBy(
          usersByFirstName.concat(usersByLastName).concat(usersByEmail),
          'id',
        );

        // Remove users that are already added.
        const filtered = lodash.reject(searchResult, u => {
          return lodash.findIndex(addedUsers, u) >= 0;
        });

        setFilteredUsers(filtered);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const resetSearch = () => {
    setSearchFocused(false);
    searchFilter(initialSearchCriteria);
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item: userProfile }) => {
    return (
      <ListItem
        title={userProfile.name || userProfile.email}
        titleStyle={s.userProfileTitle}
        leftImage={<ChatAvatar userProfile={userProfile} size={'medium'} />}
        rightImage={false}
        onPress={() => {
          setAddedUsers(addedUsers.concat(userProfile));
          resetSearch();
        }}
      />
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <Animated.View
        exiting={SlideOutUp.duration(750)}
        style={s.groupComposerContainer}>
        <Incubator.ChipsInput
          leadingAccessory={<Text style={s.toLabel}>{'To:'}</Text>}
          style={s.chipInputText}
          fieldStyle={s.chipInput}
          chips={addedUserChips()}
          // @ts-ignore property is incorrectly typed
          onChange={(_chips, changeReason, updatedChip) => {
            if (changeReason === 'removed') {
              // @ts-ignore property is incorrectly typed
              updatedChip.onDismiss && updatedChip.onDismiss();
            }
          }}
          onChangeText={(text: string) =>
            searchFilter({
              text,
              scope: SearchScope.Username,
            })
          }
          onBlur={() => setSearchFocused(false)}
          onFocus={() => setSearchFocused(true)}
          value={searchCriteria.text}
        />
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={item => `${item.id}`}
          contentInsetAdjustmentBehavior={'automatic'}
        />
      </Animated.View>
      <UserPickerModal
        ref={userPickerModalRef}
        multiple
        snapPoints={['65%']}
        onSelect={userProfile => {
          setAddedUsers(addedUsers.concat(userProfile));
        }}
        onDeselect={userProfile => {
          const current = ([] as UserProfile[]).concat(addedUsers);
          lodash.remove(current, u => u.id === userProfile.id);
          setAddedUsers(current);
        }}
        userProfiles={userSearchSet}
        selected={addedUsers}
      />
    </>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  groupComposerContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  chipInput: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.subtleGray,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minHeight: 50,
  },
  chipInputText: {
    ...theme.styles.textNormal,
    flexGrow: undefined,
  },
  toLabel: {
    ...theme.styles.textNormal,
    marginRight: 3,
    marginTop: 14,
  },
  userChipDismissIcon: {
    width: 15,
    height: 15,
  },
  userProfileTitle: {
    left: 20,
  },
}));

export default ChatGroupComposer;
