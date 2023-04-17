import { Avatar } from '@rneui/base';
import { Group } from 'types/group';
import lodash from 'lodash';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { selectUserProfilesCache } from 'store/selectors/cacheSelectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';

interface ChatAvatarInterface {
  group: Group;
}

export const ChatAvatar = ({ group }: ChatAvatarInterface) => {
  const theme = useTheme();

  const me = useSelector(selectUserProfile);
  const userProfiles = useSelector(selectUserProfilesCache);

  // Large group selection

  if (group.members.length > 2 && group.photoUrl.length) {
    return (
      <Avatar
        source={{ uri: group.photoUrl }}
        imageProps={{ resizeMode: 'cover' }}
        containerStyle={theme.styles.avatar}
      />
    );
  }

  if (group.members.length > 2) {
    <Avatar
      title={group?.avatar.title}
      titleStyle={[theme.styles.avatarTitle]}
      containerStyle={{
        ...theme.styles.avatar,
        backgroundColor: group?.avatar.color,
      }}
    />;
  }

  // Individuals selection

  let u = me;
  if (group.members.length === 2) {
    u = lodash.filter(userProfiles, i => {
      return i.id !== u?.id;
    })[0];
  }

  if (u?.photoUrl.length) {
    return (
      <Avatar
        source={{ uri: u?.photoUrl }}
        imageProps={{ resizeMode: 'contain' }}
        containerStyle={theme.styles.avatar}
      />
    );
  } else {
    return (
      <Avatar
        title={u?.avatar.title}
        titleStyle={theme.styles.avatarTitle}
        containerStyle={{
          ...theme.styles.avatar,
          backgroundColor: u?.avatar.color || theme.colors.subtleGray,
        }}
      />
    );
  }
};
