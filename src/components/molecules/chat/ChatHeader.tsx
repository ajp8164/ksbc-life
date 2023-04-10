import { AppTheme, useTheme } from 'theme';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { Text, View } from 'react-native';

import { Avatar } from '@rneui/base';
import { UserProfile } from 'types/user';
import { fontSizes } from '@react-native-ajp-elements/ui';
import { makeStyles } from '@rneui/themed';
import { useNavigation } from '@react-navigation/core';

interface ChatHeaderInterface {
  userProfile?: UserProfile;
}

export const renderHeader = (recipient: UserProfile) => {
  return <ChatHeader userProfile={recipient} />;
};

const ChatHeader = ({ userProfile }: ChatHeaderInterface) => {
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

  const renderTitle = () => {
    return (
      <View style={s.container}>
        {userProfile?.photoUrl ? (
          <Avatar
            source={{ uri: userProfile.photoUrl }}
            imageProps={{ resizeMode: 'contain' }}
            containerStyle={[theme.styles.avatar, s.avatar]}
          />
        ) : (
          <Avatar
            title={userProfile?.avatar.title}
            titleStyle={[theme.styles.avatarTitle, s.avatarTitle]}
            containerStyle={[
              theme.styles.avatar,
              s.avatar,
              { backgroundColor: userProfile?.avatar.color },
            ]}
          />
        )}
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
