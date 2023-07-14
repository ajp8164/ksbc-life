import { AppTheme, useTheme } from 'theme';
import { ExtendedGroup, Group } from 'types/group';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { getGroupName, getGroupUserProfiles } from 'lib/group';
import { useEffect, useRef, useState } from 'react';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { GroupModal } from 'components/modals/GroupModal';
import { Icon } from '@rneui/base';
import { ellipsis } from '@react-native-ajp-elements/core';
import { groupsDocumentChangeListener } from 'firebase/firestore';
import { makeStyles } from '@rneui/themed';

interface ChatHeaderTitleInterface {
  group: ExtendedGroup;
}

export const ChatHeaderTitle = ({
  group: groupProp,
}: ChatHeaderTitleInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const groupModalRef = useRef<GroupModal>(null);
  const [group, setGroup] = useState(groupProp);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    getGroupUserProfiles(group.members).then(userProfiles => {
      const name = getGroupName(group, userProfiles, { type: 'short' });
      setGroupName(name);
    });
  }, [group]);

  // Group document listener.
  useEffect(() => {
    if (!group?.id) return;

    const subscription = groupsDocumentChangeListener(
      group.id,
      async snapshot => {
        const updated = snapshot.data() as Group;
        // If the group changes we only want to update name and photo changes.
        setGroup({
          ...group,
          name: updated.name,
          photoUrl: updated.photoUrl,
        });
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!groupName.length) {
    return null;
  }

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          groupModalRef.current?.present();
        }}>
        <View style={s.container}>
          <ChatAvatar
            group={group}
            size={'small'}
            avatarStyle={{ alignSelf: 'center' }}
          />
          <View style={s.titleStatusContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={s.title}>{ellipsis(groupName, 25)}</Text>
              <Icon
                name="chevron-down"
                type={'material-community'}
                color={theme.colors.brandSecondary}
                style={{ top: -3 }}
                size={24}
              />
            </View>
            {/* {online ? (
              <Text style={s.online}>{'Online'}</Text>
            ) : (
              <Text style={s.offline}>{'Offline'}</Text>
            )} */}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <GroupModal ref={groupModalRef} group={group} />
    </>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    flexDirection: 'row',
  },
  offline: {
    ...theme.styles.textTiny,
    color: theme.colors.assertive,
    top: -2,
  },
  online: {
    ...theme.styles.textSmall,
    color: theme.colors.success,
    top: -2,
  },
  title: {
    ...theme.styles.textLarge,
    ...theme.styles.textBold,
  },
  titleStatusContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
}));
