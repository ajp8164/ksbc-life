import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import {
  MoreNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import React, { useContext, useEffect } from 'react';
import { UserProfile, UserRole } from 'types/user';
import { useDispatch, useSelector } from 'react-redux';

import { AuthContext } from 'lib/auth';
import { Avatar } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { updateUserProfile } from 'store/slices/user';
import { usersDocumentChangeListener } from 'firebase/firestore/users';

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
    <ScrollView
      style={theme.styles.view}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior={'automatic'}>
      <Divider />
      {userProfile && userProfile.role !== UserRole.Anonymous ? (
        <ListItem
          title={userProfile.name || userProfile.email || 'My Profile'}
          leftImage={
            userProfile.photoUrl.length ? (
              <Avatar
                source={{ uri: userProfile.photoUrl }}
                imageProps={{ resizeMode: 'contain' }}
                containerStyle={s.avatar}
              />
            ) : (
              <Avatar
                title={userProfile?.avatar.title}
                titleStyle={theme.styles.avatarTitleSmall}
                containerStyle={[
                  s.avatar,
                  { backgroundColor: userProfile?.avatar.color },
                ]}
              />
            )
          }
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
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  avatar: {
    ...theme.styles.avatarSmall,
    left: -3,
    top: 1,
  },
  emptyListContainer: {},
}));

export default MoreScreen;
