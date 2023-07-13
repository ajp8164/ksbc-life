import { AppTheme, useTheme } from 'theme';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { getGroupName, getGroupUserProfiles } from 'lib/group';
import { useEffect, useRef, useState } from 'react';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ExtendedGroup } from 'types/group';
import { GroupModal } from 'components/modals/GroupModal';
import { Icon } from '@rneui/base';
import { ellipsis } from '@react-native-ajp-elements/core';
import { makeStyles } from '@rneui/themed';

interface ChatHeaderTitleInterface {
  group: ExtendedGroup;
}

export const ChatHeaderTitle = ({ group }: ChatHeaderTitleInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const groupModalRef = useRef<GroupModal>(null);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    getGroupUserProfiles(group.members).then(userProfiles => {
      const name = getGroupName(group, userProfiles, { type: 'short' });
      setGroupName(name);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {/* <Text style={s.status}>{'online'}</Text> */}
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
  titleStatusContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    ...theme.styles.textLarge,
    ...theme.styles.textBold,
  },
  status: {
    ...theme.styles.textSmall,
    top: -3,
  },
}));
