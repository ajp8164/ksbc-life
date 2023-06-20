import {
  HomeNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import {
  PageContentItem,
  PageContentItemAssignment,
} from 'types/pageContentItem';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

import { AuthContext } from 'lib/auth';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageContentItemsView from 'components/views/PageContentItemsView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pageContentItemCollectionChangeListener } from 'firebase/firestore';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'theme';
import { viewport } from '@react-native-ajp-elements/ui';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigatorParamList, 'Home'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();

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
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <ChatAvatar userProfile={userProfile} onPress={doAccountAction} />
      ),
    });
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
        where: [
          {
            fieldPath: 'assignment',
            opStr: '==',
            value: PageContentItemAssignment.Ministries,
          },
        ],
      },
    );
    return subscription;
  }, []);

  const sortContentItems = (items: PageContentItem[]) => {
    return items.sort((a, b) => {
      return a.ordinal - b.ordinal;
    });
  };

  const doAccountAction = () => {
    if (auth.userIsAuthenticated && userProfile) {
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

export default HomeScreen;
