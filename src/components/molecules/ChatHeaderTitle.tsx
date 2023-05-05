import { AppTheme, useTheme } from 'theme';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { EditGroupModal } from 'components/modals/EditGroupModal';
import { Group } from 'types/group';
import { Icon } from '@rneui/base';
import { getGroupName } from 'lib/group';
import { makeStyles } from '@rneui/themed';
import { useRef } from 'react';

interface ChatHeaderTitleInterface {
  group: Group;
}

export const ChatHeaderTitle = ({ group }: ChatHeaderTitleInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editGroupModalRef = useRef<EditGroupModal>(null);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          editGroupModalRef.current?.present();
        }}>
        <View style={s.container}>
          <ChatAvatar
            group={group}
            size={'small'}
            avatarStyle={{ alignSelf: 'center' }}
          />
          <View style={s.titleStatusContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={s.title}>
                {group && `${getGroupName(group, { type: 'short' })}`}
              </Text>
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
      <EditGroupModal ref={editGroupModalRef} group={group} />
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
