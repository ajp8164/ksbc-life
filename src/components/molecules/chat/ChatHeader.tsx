import { AppTheme, useTheme } from 'theme';
import { Avatar, Button, Icon } from '@rneui/base';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { Text, View } from 'react-native';

import { UserProfile } from 'types/user';
import { fontSizes } from '@react-native-ajp-elements/ui';
import { makeStyles } from '@rneui/themed';
import { useNavigation } from '@react-navigation/core';

interface ChatHeaderInterface {
  buttonIconName?: string;
  buttonIconColor?: string;
  buttonIconSize?: number;
  buttonIconType?: string;
  onPressButton?: () => void;
  userProfile?: UserProfile;
}

export const ChatHeader = ({
  buttonIconName,
  buttonIconColor,
  buttonIconSize = 28,
  buttonIconType = 'material-community',
  onPressButton = () => {
    return;
  },
  userProfile,
}: ChatHeaderInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const navigation = useNavigation();

  const renderBackButton = () => {
    return (
      <HeaderBackButton
        label={'Back'}
        labelVisible={true}
        tintColor={theme.colors.brandSecondary}
        style={{ top: 17 }}
        onPress={navigation.goBack}
      />
    );
  };

  const renderRightButton = () => {
    if (!buttonIconName) return null;
    return (
      <Button
        type={'clear'}
        containerStyle={{ top: 18 }}
        icon={
          <Icon
            name={buttonIconName}
            type={buttonIconType}
            color={buttonIconColor || theme.colors.brandSecondary}
            size={buttonIconSize}
          />
        }
        onPress={onPressButton}
      />
    );
  };

  const renderTitle = () => {
    return (
      <View style={s.container}>
        {userProfile?.photoUrl ? (
          <Avatar
            source={{ uri: userProfile.photoUrl }}
            imageProps={{ resizeMode: 'contain' }}
            containerStyle={[theme.styles.avatar, s.avatar]}
          />
        ) : userProfile ? (
          <Avatar
            title={userProfile?.avatar.title}
            titleStyle={[theme.styles.avatarTitle, s.avatarTitle]}
            containerStyle={[
              theme.styles.avatar,
              s.avatar,
              { backgroundColor: userProfile?.avatar.color },
            ]}
          />
        ) : null}
        <Text style={s.title}>
          {userProfile?.name || userProfile?.email || ''}
        </Text>
      </View>
    );
  };

  return (
    <Header
      title={'Chat'}
      headerStyle={{ height: 118 }}
      headerShadowVisible={true}
      headerLeft={() => renderBackButton()}
      headerRight={() => renderRightButton()}
      headerTitle={() => renderTitle()}
    />
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  container: {
    alignItems: 'center',
    top: 17,
  },
  title: {
    ...theme.styles.textTiny,
    top: 5,
  },
  avatar: {
    width: 45,
    height: 45,
  },
  avatarTitle: {
    fontSize: fontSizes.xl,
  },
}));
