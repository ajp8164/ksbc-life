import { Alert, ScrollView, Text, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import { Icon, Image } from '@rneui/base';
import {
  MainNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import React, { useEffect } from 'react';
import { signOut, useUnauthorizeUser } from 'lib/auth';

import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { biometricAuthentication } from 'lib/biometricAuthentication';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'UserProfile'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const UserProfileScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const unauthorizeUser = useUnauthorizeUser();
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    navigation.setOptions({
      // headerTitle: user?.displayName || 'My  Profile',
      headerTitle: 'My  Profile',
    });
  });

  const confirmSignOut = async () => {
    await biometricAuthentication()
      .then(() => {
        Alert.alert(
          'Confirm Signing Out',
          'Are you sure you want to signout?',
          [
            {
              text: 'Yes, sign out',
              onPress: doSignOut,
              style: 'destructive',
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      })
      .catch();
  };

  const doSignOut = () => {
    signOut().then(() => {
      unauthorizeUser();
      navigation.goBack();
    });
  };

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        {userProfile?.photoUrl ? (
          <Image
            source={{ uri: userProfile?.photoUrl }}
            containerStyle={s.avatar}
          />
        ) : (
          <Icon
            name="account-circle"
            type={'material-community'}
            color={theme.colors.brandSecondary}
            size={100}
            style={{ marginTop: 15 }}
          />
        )}
        {userProfile?.name && (
          <Text style={s.profileName}>{userProfile.name}</Text>
        )}
        {userProfile?.email && (
          <Text style={s.profileEmail}>{userProfile.email}</Text>
        )}
        <Divider />
        <ListItem
          title={'Sign Out'}
          titleStyle={s.signOut}
          position={['first', 'last']}
          rightImage={false}
          onPress={confirmSignOut}
        />
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  profileName: {
    ...theme.styles.textNormal,
    ...theme.styles.textBold,
    textAlign: 'center',
  },
  profileEmail: {
    ...theme.styles.textSmall,
    textAlign: 'center',
  },
  signInButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  signOut: {
    ...theme.styles.textBold,
    textAlign: 'center',
    width: '100%',
    color: theme.colors.brandPrimary,
  },
}));

export default UserProfileScreen;
