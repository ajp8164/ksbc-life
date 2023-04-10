import { AppTheme, useTheme } from 'theme';
import { Avatar, Button, Icon, Image } from '@rneui/base';
import {
  HomeNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import {
  PageContentItem,
  PageContentItemAssignment,
} from 'types/pageContentItem';
import React, { useContext, useEffect, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';

import { AuthContext } from 'lib/auth';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageContentItemsView from 'components/views/PageContentItemsView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Text } from 'react-native';
import { UserRole } from 'types/user';
import { makeStyles } from '@rneui/themed';
import { pageContentItemCollectionChangeListener } from 'firebase/firestore/pageContentItems';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { viewport } from '@react-native-ajp-elements/ui';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigatorParamList, 'Home'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

  const [pageContentItems, setPageContentItems] = useState<PageContentItem[]>(
    [],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'ministries':
        return renderMinistriesContent();
      case 'events':
        return null; //renderEventsContent();
      case 'my-feed':
        return null; //renderMyFeedContent();
      default:
        return null;
    }
  };

  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'ministries', title: 'Ministries' },
    { key: 'events', title: 'Events' },
    { key: 'my-feed', title: 'My Feed' },
  ]);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    const subscription = pageContentItemCollectionChangeListener(
      snapshot => {
        const items: PageContentItem[] = [];
        snapshot.docs.forEach(d => {
          items.push({ ...d.data(), id: d.id } as PageContentItem);
        });
        setPageContentItems(sortContentItems(items));
      },
      {
        where: {
          fieldPath: 'assignment',
          opStr: '==',
          value: PageContentItemAssignment.Ministries,
        },
      },
    );
    return subscription;
  }, []);

  const sortContentItems = (items: PageContentItem[]) => {
    return items.sort((a, b) => {
      return a.ordinal - b.ordinal;
    });
  };

  const setAvatar = () => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          <Button
            type={'clear'}
            icon={
              userProfile && userProfile.photoUrl ? (
                <Image
                  source={{ uri: userProfile.photoUrl }}
                  containerStyle={s.avatar}
                />
              ) : userProfile?.role === UserRole.Anonymous ? (
                <Icon
                  name="account-circle"
                  type={'material-community'}
                  color={theme.colors.brandSecondary}
                  size={28}
                />
              ) : (
                <Avatar
                  title={userProfile?.avatar.title}
                  titleStyle={theme.styles.avatarTitle}
                  containerStyle={{
                    ...theme.styles.avatar,
                    backgroundColor: userProfile?.avatar.color,
                  }}
                />
              )
            }
            onPress={doAccountAction}
          />
        </>
      ),
    });
  };

  const doAccountAction = () => {
    if (auth.userIsAuthenticated && userProfile?.role !== UserRole.Anonymous) {
      navigation.navigate('MoreTab', {
        screen: 'More',
        params: {
          subNav: 'UserProfile',
        },
      });
    } else {
      auth.presentSignInModal();
    }
  };

  const renderMinistriesContent = () => {
    return (
      <ScrollView
        contentContainerStyle={[
          theme.styles.view,
          { marginTop: 15, paddingBottom: 15 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <PageContentItemsView items={pageContentItems} />
      </ScrollView>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route }) => (
          <Text style={theme.styles.textNormal}>{route.title}</Text>
        )}
        indicatorStyle={{
          backgroundColor: theme.colors.brandSecondary,
          height: 5,
        }}
        style={{ backgroundColor: theme.colors.white }}
      />
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        initialLayout={{ width: viewport.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    top: -5,
  },
}));

export default HomeScreen;
