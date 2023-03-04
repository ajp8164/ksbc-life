import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import {
  MoreNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { Image } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignInModal } from 'components/modals/SignInModal';
import { UserRole } from 'types/user';
import { appConfig } from 'config';
import auth from '@react-native-firebase/auth';
import { makeStyles } from '@rneui/themed';
import { saveAdminMode } from 'store/slices/appSettings';
import { saveUser } from 'store/slices/userProfile';
import { selectRoles } from 'store/selectors/userProfileSelectors';
import { selectUser } from 'store/selectors/userProfileSelectors';

export type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'More'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const MoreScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const signInModalRef = useRef<SignInModal>(null);
  const user = useSelector(selectUser);
  const userRoles = useSelector(selectRoles);

  useEffect(() => {
    if (route.params?.subNav) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(route.params.subNav as any); // Could not discern type
      navigation.setParams({ subNav: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.subNav]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log('ASC', user);
      // Remove non-serializable properties (functions).
      dispatch(saveUser({ user: JSON.parse(JSON.stringify(user)) }));
      signInModalRef.current?.dismiss();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          {userRoles.includes(UserRole.admin) && (
            <Button
              type={'clear'}
              title={'Enter Admin'}
              titleStyle={{ color: theme.colors.assertive }}
              onPress={() => {
                dispatch(saveAdminMode({ value: true }));
                navigation.navigate('AdminTab');
              }}
            />
          )}
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <ScrollView
        style={theme.styles.view}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {user ? (
          <ListItem
            title={user.displayName || user.email || 'My Profile'}
            leftImage={
              user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
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
            onPress={() => signInModalRef.current?.present()}
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
      </ScrollView>
      <SignInModal ref={signInModalRef} />
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
