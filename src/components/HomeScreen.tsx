import { AppTheme, useTheme } from 'theme';
import { Button, Icon, Image } from '@rneui/base';
import {
  HomeNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import React, { useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import { openShareSheet, viewport } from '@react-native-ajp-elements/ui';

import { AuthContext } from 'lib/auth';
import Card from 'components/molecules/Card';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView } from 'components/atoms/TabView';
import { makeStyles } from '@rneui/themed';
import { openURL } from '@react-native-ajp-elements/core';
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

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

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
        contentContainerStyle={{ paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Card
          title={'Welcome'}
          body={'Worship 11:00 am\nLife Groups 9:30 am'}
          imageSource={require('img/ksbc-front.jpg')}
          imageHeight={300}
          cardStyle={theme.styles.viewWidth}
        />
        <Card
          title={'Daily Devotion'}
          body={
            'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.'
          }
          footer={'John 3:16 CSB'}
          buttons={[
            {
              label: 'Share',
              icon: 'share-variant',
              onPress: () => {
                openShareSheet({
                  title: 'John 3:16 CSB',
                  message:
                    'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
                });
              },
            },
            {
              label: 'Read',
              icon: 'book-open-variant',
              onPress: () => {
                openURL('https://www.bible.com/bible/1713/JHN.3.CSB');
              },
            },
          ]}
          cardStyle={s.transparentCard}
          titleStyle={{ textAlign: 'left' }}
        />
        <View style={s.cardRow}>
          <Card
            imageSource={require('img/life-kids.jpg')}
            flexBasis={viewport.width / 2 - 23}
            cardStyle={s.lightCard}
          />
          <Card
            imageSource={require('img/life-kids.jpg')}
            flexBasis={viewport.width / 2 - 23}
            cardStyle={s.lightCard}
          />
        </View>
        <Card
          imageSource={require('img/life-kids.jpg')}
          cardStyle={s.lightCard}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
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

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    top: -5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...theme.styles.viewWidth,
  },
  transparentCard: {
    backgroundColor: theme.colors.transparent,
    ...theme.styles.viewWidth,
  },
  lightCard: {
    backgroundColor: theme.colors.stickyWhite,
    ...theme.styles.viewWidth,
  },
}));

export default HomeScreen;
