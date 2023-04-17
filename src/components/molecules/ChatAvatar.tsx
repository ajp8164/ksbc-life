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
  avatarStyle?: ViewStyle;
  group?: Group;
  titleStyle?: TextStyle;
  userProfile?: UserProfile;
}

export const ChatAvatar = ({
  avatarStyle,
  group,
  titleStyle,
  userProfile,
}: ChatAvatarInterface) => {
  const theme = useTheme();

  const me = useSelector(selectUserProfile);
  const userProfiles = useSelector(selectUserProfilesCache);

  const renderUserAvatar = (userProfile?: UserProfile) => {
    if (userProfile?.photoUrl.length) {
      return (
        <Avatar
          source={{ uri: userProfile.photoUrl }}
          imageProps={{ resizeMode: 'contain' }}
          containerStyle={[theme.styles.avatarMedium, avatarStyle]}
        />
      );
    } else {
      return (
        <Avatar
          title={userProfile?.avatar.title}
          titleStyle={[theme.styles.avatarTitleMedium, titleStyle]}
          containerStyle={{
            ...theme.styles.avatarMedium,
            backgroundColor:
              userProfile?.avatar.color || theme.colors.subtleGray,
            ...avatarStyle,
          }}
        />
      );
    }
  };

  // Request is for single user (no group)

  if (!group) {
    return renderUserAvatar(userProfile);
  }

  // Large group selection

  if (group.members.length > 2 && group.photoUrl.length) {
    return (
      <Avatar
        source={{ uri: group.photoUrl }}
        imageProps={{ resizeMode: 'cover' }}
        containerStyle={[theme.styles.avatarSmall, avatarStyle]}
      />
    );
  }

  if (group.members.length > 2) {
    <Avatar
      title={group?.avatar.title}
      titleStyle={[theme.styles.avatarTitleMedium, titleStyle]}
      containerStyle={{
        ...theme.styles.avatarSmall,
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
