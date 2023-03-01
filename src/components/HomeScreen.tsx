import { AppTheme, useTheme } from 'theme';
import { ScrollView, View } from 'react-native';
import React, { useEffect, useRef } from 'react';

import { makeStyles } from '@rneui/themed';
import { openShareSheet, viewport } from '@react-native-ajp-elements/ui';
import Card from 'components/molecules/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openURL } from '@react-native-ajp-elements/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  HomeNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import { Button, Icon, Image } from '@rneui/base';
import { SignInModal } from 'components/modals/SignInModal';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from 'store/slices/userProfile';
import { selectUser } from 'store/selectors/userProfileSelectors';
import auth from '@react-native-firebase/auth';
import { CompositeScreenProps } from '@react-navigation/core';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigatorParamList, 'Home'>,
  NativeStackScreenProps<MoreNavigatorParamList>
>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const signInModalRef = useRef<SignInModal>(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setAvatar = () => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          <Button
            type={'clear'}
            icon={
              user && user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
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
            // onPress={signInModalRef.current?.present}
            onPress={doAccountAction}
          />
        </>
      ),
    });
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      // Remove non-serializable properties (functions).
      dispatch(saveUser({ user: JSON.parse(JSON.stringify(user)) }));
      signInModalRef.current?.dismiss();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAccountAction = () => {
    if (user) {
      navigation.navigate('More', { subNav: 'UserProfile' });
    } else {
      signInModalRef.current?.present();
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Card
          title={'Welcome'}
          body={'Worship 11:00 am\nLife Groups 9:30 am'}
          imageSource={require('img/ksbc-front.jpg')}
          imageHeight={300}
        />
        <Card
          title={'Daily Devotion'}
          body={
            'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life. For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.'
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
          cardStyle={{ backgroundColor: theme.colors.transparent }}
          titleStyle={{ textAlign: 'left' }}
        />
        <View style={s.cardRow}>
          <Card
            imageSource={require('img/life-kids.jpg')}
            flexBasis={viewport.width / 2 - 23}
            cardStyle={{ backgroundColor: theme.colors.stickyWhite }}
          />
          <Card
            imageSource={require('img/life-kids.jpg')}
            flexBasis={viewport.width / 2 - 23}
            cardStyle={{ backgroundColor: theme.colors.stickyWhite }}
          />
        </View>
        <Card
          imageSource={require('img/life-kids.jpg')}
          cardStyle={{ backgroundColor: theme.colors.stickyWhite }}
        />
      </ScrollView>
      <SignInModal ref={signInModalRef} />
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default HomeScreen;
