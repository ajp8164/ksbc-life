import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import {
  MoreNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import React, { useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { UserProfile, UserRole } from 'types/user';
import { useDispatch, useSelector } from 'react-redux';

import { AuthContext } from 'lib/auth';
import { CompositeScreenProps } from '@react-navigation/core';
import { Image } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { updateUserProfile } from 'store/slices/user';
import { usersDocumentChangeListener } from 'firestore/users';

export type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'More'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const MoreScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    // Updates my profile if my information changed (e.g., admin action).
    const subscription = usersDocumentChangeListener(
      userProfile?.id || '',
      documentSnapshot => {
        userProfile &&
          dispatch(
            updateUserProfile({
              userProfile: documentSnapshot.data() as UserProfile,
            }),
          );
      },
    );

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (route.params?.subNav) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(route.params.subNav as any); // Could not discern type.
      navigation.setParams({ subNav: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.subNav]);

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {userProfile ? (
          <ListItem
            title={userProfile.name || userProfile.email || 'My Profile'}
            leftImage={
              userProfile.photoUrl ? (
                <Image
                  source={{ uri: userProfile.photoUrl }}
                  containerStyle={s.avatar}
                />
              ) : (
                'account-circle-outline'
              )
            }
            leftImageType={'material-community'}
            position={['first', 'last']}
            onPress={() => navigation.navigate('UserProfile')}
          />
        ) : (
          <ListItem
            title={'Sign In or Sign Up'}
            leftImage={'account-circle-outline'}
            leftImageType={'material-community'}
            position={['first', 'last']}
            onPress={() => auth.presentSignInModal()}
          />
        )}
        <Divider />
        <ListItem
          title={'App Settings'}
          position={['first']}
          leftImage={'cog-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AppSettings')}
        />
        <ListItem
          title={`About ${appConfig.appName}`}
          position={['last']}
          leftImage={'information-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('About')}
        />
        <Divider />
        {(userProfile?.role === UserRole.Owner ||
          userProfile?.role === UserRole.Admin) && (
          <ListItem
            title={'Administration'}
            position={['first', 'last']}
            leftImage={'database-outline'}
            leftImageType={'material-community'}
            onPress={() => {
              navigation.navigate('AdminHome');
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    left: -3,
    top: 1,
  },
  adminButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
}));

export default MoreScreen;
