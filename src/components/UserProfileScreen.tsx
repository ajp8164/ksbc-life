import { AppTheme, useTheme } from 'theme';
import {
  MoreNavigatorParamList,
  MainNavigatorParamList,
} from 'types/navigation';
import { Alert, ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';
import { makeStyles } from '@rneui/themed';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/selectors/userProfileSelectors';
import { Icon, Image } from '@rneui/base';
import { signOut } from 'lib/userAuthentication';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import { biometricAuthentication } from 'lib/biometricAuthentication';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'UserProfile'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const UserProfileScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const user = useSelector(selectUser);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: user?.displayName || '',
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
    signOut()
      .then(() => {
        navigation.goBack();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        console.log(e.message);
      });
  };

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        {user?.photoURL ? (
          <Image source={{ uri: user?.photoURL }} containerStyle={s.avatar} />
        ) : (
          <Icon
            name="account-circle"
            type={'material-community'}
            color={theme.colors.brandSecondary}
            size={28}
          />
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
