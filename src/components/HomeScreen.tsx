import { AppTheme, useTheme } from 'theme';
import { ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';

import { makeStyles } from '@rneui/themed';
import { openShareSheet, viewport } from '@react-native-ajp-elements/ui';
import Card from 'components/molecules/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openURL } from '@react-native-ajp-elements/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeNavigatorParamList } from 'types/navigation';
import { Button, Icon } from '@rneui/base';

type Props = NativeStackScreenProps<HomeNavigatorParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          <Button
            type={'clear'}
            icon={
              <Icon
                name="account-circle"
                type={'material-community'}
                color={theme.colors.brandSecondary}
                size={28}
              />
            }
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 15 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Card
          title={"You're Invited"}
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
          />
          <Card
            imageSource={require('img/life-kids.jpg')}
            flexBasis={viewport.width / 2 - 23}
          />
        </View>
        <Card imageSource={require('img/life-kids.jpg')} />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default HomeScreen;
