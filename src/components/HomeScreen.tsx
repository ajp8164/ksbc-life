import { Alert, ScrollView, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon, Image } from '@rneui/base';
import {
  HomeNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import React, { useEffect, useRef } from 'react';
import { openShareSheet, viewport } from '@react-native-ajp-elements/ui';

import Card from 'components/molecules/Card';
import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInModal } from 'components/modals/SignInModal';
import auth from '@react-native-firebase/auth';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';
import { openURL } from '@react-native-ajp-elements/core';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useAuthorizeUser } from 'lib/auth';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigatorParamList, 'Home'>,
  NativeStackScreenProps<MoreNavigatorParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const authorizeUser = useAuthorizeUser();
  const authorizeUserDebounced = useRef(lodash.debounce(authorizeUser, 200));
  const signInModalRef = useRef<SignInModal>(null);
  const signInModalPresentedRef = useRef(false);
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(credentials => {
      // This handler is called multiple times.
      // See https://stackoverflow.com/a/40436769
      if (signInModalPresentedRef.current) {
        authorizeUserDebounced.current(credentials, {
          onError: onAuthError,
          onAuthorized: () => {
            signInModalRef.current?.dismiss();
            signInModalPresentedRef.current = false;
          },
        });
      }
    });
    return unsubscribe;
  }, []);

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

  const onAuthError = () => {
    Alert.alert(
      'Sign In Failed',
      'There was a problem signing in. Please try again.',
      [{ text: 'OK' }],
      { cancelable: false },
    );
  };

  const doAccountAction = () => {
    if (userProfile) {
      navigation.navigate('More', { subNav: 'UserProfile' });
    } else {
      signInModalRef.current?.present();
      signInModalPresentedRef.current = true;
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
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
      <SignInModal ref={signInModalRef} />
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
