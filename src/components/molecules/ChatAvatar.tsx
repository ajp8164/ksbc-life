import { Avatar, Icon } from '@rneui/base';
import { TextStyle, ViewStyle } from 'react-native';

import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { selectUserProfilesCache } from 'store/selectors/cacheSelectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';

interface ChatAvatarInterface {
  avatarStyle?: ViewStyle;
  group?: Group;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large' | 'giant';
  titleStyle?: TextStyle;
  userProfile?: UserProfile;
}

export const ChatAvatar = ({
  avatarStyle,
  group,
  onPress,
  size = 'small',
  titleStyle,
  userProfile,
}: ChatAvatarInterface) => {
  const theme = useTheme();

  const me = useSelector(selectUserProfile);
  const userProfiles = useSelector(selectUserProfilesCache);

  const _avatarStyle =
    size === 'small'
      ? theme.styles.avatarSmall
      : size === 'medium'
      ? theme.styles.avatarMedium
      : size === 'large'
      ? theme.styles.avatarLarge
      : theme.styles.avatarGiant;

  const _titleStyle =
    size === 'small'
      ? theme.styles.avatarTitleSmall
      : size === 'medium'
      ? theme.styles.avatarTitleMedium
      : size === 'large'
      ? theme.styles.avatarTitleLarge
      : theme.styles.avatarTitleGiant;

  const _iconSize =
    size === 'small' ? 20 : size === 'medium' ? 28 : size === 'large' ? 36 : 42;

  const renderUserAvatar = (userProfile?: UserProfile) => {
    if (userProfile?.photoUrl.length) {
      return (
        <Avatar
          source={{ uri: userProfile.photoUrl }}
          imageProps={{ resizeMode: 'contain' }}
          containerStyle={[_avatarStyle, avatarStyle]}
          onPress={onPress}
        />
      );
    } else {
      return (
        <Avatar
          title={userProfile?.avatar.title}
          titleStyle={[_titleStyle, titleStyle]}
          containerStyle={{
            ..._avatarStyle,
            backgroundColor:
              userProfile?.avatar.color || theme.colors.subtleGray,
            ...avatarStyle,
          }}
          onPress={onPress}
        />
      );
    }
  };

  // Request is for single user (no group)

  if (!userProfile) {
    // Seems to be a bug which allows the previous avatar image to remain
    // displayed. Use an icon to avoid.
    return (
      <Icon
        name={'account-circle'}
        type={'material-community'}
        color={theme.colors.brandSecondary}
        size={(avatarStyle?.width as number) || (_avatarStyle.width as number)}
        onPress={onPress}
      />
    );
  }

  if (!group) {
    return renderUserAvatar(userProfile);
  }

  // Remove possible duplicates.
  const members = lodash.uniq(group.members);

  // Large group selection

  if (members.length > 2 && group.photoUrl.length) {
    return (
      <Avatar
        source={{ uri: group.photoUrl }}
        imageProps={{ resizeMode: 'cover' }}
        containerStyle={[_avatarStyle, avatarStyle]}
        onPress={onPress}
      />
    );
  }

  if (members.length > 2) {
    return (
      <Avatar
        title={group?.avatar.title}
        titleStyle={[_titleStyle, titleStyle]}
        icon={{
          name: 'account-multiple',
          type: 'material-community',
          size: _iconSize,
        }}
        containerStyle={{
          ..._avatarStyle,
          backgroundColor: group?.avatar.color,
          ...avatarStyle,
        }}
        onPress={onPress}
      />
    );
  }

  // Group individual selection

  let u = me;
  if (members.length === 2) {
    // Filter me out
    u = lodash.filter(userProfiles, i => {
      return i.id !== u?.id;
    })[0];
  }
  // Else it's me only

  return renderUserAvatar(u);
};
