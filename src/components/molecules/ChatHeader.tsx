import { AppTheme, useTheme } from 'theme';
import { Avatar, Icon } from '@rneui/base';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { Text, View } from 'react-native';

import { UserProfile } from 'types/user';
import { makeStyles } from '@rneui/themed';
import { useNavigation } from '@react-navigation/core';

interface ChatHeaderInterface {
  userProfile?: UserProfile;
}

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
            avatarStyle={{ borderRadius: 45 }}
            size={45}
          />
        ) : (
          <Icon
            name={'account-circle-outline'}
            type={'material-community'}
            color={theme.colors.icon}
            size={45}
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
}));

export default ChatHeader;
