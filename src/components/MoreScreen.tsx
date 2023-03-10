import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import {
  MoreNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import React, { useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { Image } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignInContext } from 'components/AppMain';
import { UserRole } from 'types/user';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { saveAdminMode } from 'store/slices/appSettings';
import { selectUserProfile } from 'store/selectors/userSelectors';

export type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'More'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const MoreScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const signInModal = useContext(SignInContext);
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    if (route.params?.subNav) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(route.params.subNav as any); // Could not discern type.
      navigation.setParams({ subNav: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.subNav]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          {!userProfile?.roles.includes(UserRole.Admin) && ( // TODO: remove ! - TESTING
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
            onPress={() => signInModal.present()}
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
