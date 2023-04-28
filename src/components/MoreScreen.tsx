import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import {
  MoreNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from 'lib/auth';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { UserRole } from 'types/user';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

export type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'More'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const MoreScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

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
      {userProfile ? (
        <ListItem
          title={userProfile.name || userProfile.email || 'My Profile'}
          leftImage={
            <ChatAvatar userProfile={userProfile} avatarStyle={s.avatar} />
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

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  avatar: {
    left: -3,
    top: 1,
  },
  emptyListContainer: {},
}));

export default MoreScreen;
