import { AppTheme, useTheme } from 'theme';
import { Button, Icon, Image } from '@rneui/base';
import {
  HomeNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import {
  PageContentItem,
  PageContentItemAssignment,
} from 'types/pageContentItem';
import React, { useContext, useEffect, useState } from 'react';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

import { AuthContext } from 'lib/auth';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PageContentItemsView from 'components/views/PageContentItemsView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { TabView } from 'components/atoms/TabView';
import { makeStyles } from '@rneui/themed';
import { pageContentItemCollectionChangeListener } from 'firestore/pageContentItems';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigatorParamList, 'Home'>,
  NativeStackScreenProps<MoreNavigatorParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

  const [pageContentItems, setPageContentItems] = useState<PageContentItem[]>(
    [],
  );

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
              ) : (
                <Icon
                  name="account-circle"
                  type={'material-community'}
                  color={theme.colors.brandSecondary}
                  size={28}
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
    if (auth.userIsAuthenticated) {
      navigation.navigate('More', { subNav: 'UserProfile' });
    } else {
      auth.presentSignInModal();
    }
  };

  const renderPageContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{ marginTop: 15, paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <PageContentItemsView items={pageContentItems} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => (
          <DefaultTabBar
            // @ts-ignore property is incorrectly typed
            tabBarUnderlineStyle={{
              backgroundColor: theme.colors.brandSecondary,
            }}
            tabStyle={{ paddingBottom: 0 }}
            textStyle={theme.styles.textNormal}
            inactiveTextColor={theme.colors.textDim}
            style={{ borderBottomColor: theme.colors.subtleGray }}
          />
        )}>
        <TabView tabLabel={'Ministries'} style={{ flex: 1 }}>
          {renderPageContent()}
        </TabView>
        <TabView tabLabel={'Events'} style={{ flex: 1 }}>
          {/* {renderContentEditor(formik)} */}
        </TabView>
        <TabView tabLabel={'My Feed'} style={{ flex: 1 }}>
          {/* {renderScheduleEditor(formik)} */}
        </TabView>
      </ScrollableTabView>
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
