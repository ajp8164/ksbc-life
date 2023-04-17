import { TextStyle, ViewStyle } from 'react-native';

import { Avatar } from '@rneui/base';
import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { selectUserProfilesCache } from 'store/selectors/cacheSelectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';

interface ChatAvatarInterface {
  anonymous?: boolean;
  avatarStyle?: ViewStyle;
  group?: Group;
  size?: 'small' | 'medium' | 'large' | 'giant';
  titleStyle?: TextStyle;
  userProfile?: UserProfile;
}

export const ChatAvatar = ({
  anonymous,
  avatarStyle,
  group,
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

  const renderUserAvatar = (userProfile?: UserProfile) => {
    if (userProfile?.photoUrl.length) {
      return (
        <Avatar
          source={{ uri: userProfile.photoUrl }}
          imageProps={{ resizeMode: 'contain' }}
          containerStyle={[_avatarStyle, avatarStyle]}
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
        />
      );
    }
  };

  // Request is for single user (no group)

  if (anonymous) {
    return (
      <Avatar
        icon={{
          name: 'account-circle',
          type: 'material-community',
          color: theme.colors.brandSecondary,
          size:
            (avatarStyle?.width as number) || (_avatarStyle.width as number),
        }}
        containerStyle={{ ..._avatarStyle, ...avatarStyle }}
      />
    );
  }

  if (!group) {
    return renderUserAvatar(userProfile);
  }

  // Large group selection

  if (group.members.length > 2 && group.photoUrl.length) {
    return (
      <Avatar
        source={{ uri: group.photoUrl }}
        imageProps={{ resizeMode: 'cover' }}
        containerStyle={[_avatarStyle, avatarStyle]}
      />
    );
  }

  if (group.members.length > 2) {
    <Avatar
      title={group?.avatar.title}
      titleStyle={[_titleStyle, titleStyle]}
      containerStyle={{
        ..._avatarStyle,
        backgroundColor: group?.avatar.color,
        ...avatarStyle,
      }}
    />;
  }

  // Group individual selection

  let u = me;
  if (group.members.length === 2) {
    u = lodash.filter(userProfiles, i => {
      return i.id !== u?.id;
    })[0];
  }

  return renderUserAvatar(u);
};
