import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BulletList } from '@react-native-ajp-elements/ui';
import { Button } from '@rneui/base';
import Card from 'components/molecules/Card';
import { CompositeScreenProps } from '@react-navigation/core';
import { EditSermonModal } from 'components/admin/modals/EditSermonModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoCard from 'components/molecules/VideoCard';
import { makeStyles } from '@rneui/themed';
import { selectSermon } from 'store/selectors/adminSelectors';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminSermon'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminSermonScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editSermonModalRef = useRef<EditSermonModal>(null);
  const sermon = useSelector(selectSermon(route.params?.sermonId));
  const [showVideo, setShowVideo] = useState(false);
  const [paused, setPaused] = useState(false);

  const bibleReference = sermon?.bibleReference;
  let bibleReferenceStr = '';
  if (bibleReference) {
    bibleReferenceStr =
      bibleReference.verse.end.length > 0
        ? `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}-${bibleReference.verse.end}`
        : `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}`;
  }

  useEffect(() => {
    navigation.setOptions({
      title: sermon?.title || '',
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          type={'clear'}
          title={'Edit'}
          onPress={() => editSermonModalRef.current?.present('Edit Sermon')}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        {sermon ? (
          <>
            <Card
              header={sermon.seriesTitle}
              title={sermon.title}
              body={`${sermon.date} | ${sermon.pasteur}`}
              footer={bibleReferenceStr}
            />
            <Card
              header={'Life Application'}
              headerStyle={s.laHeader}
              title={sermon.lifeApplication.title}
              titleStyle={s.laTitle}
              BodyComponent={
                <View style={{ alignItems: 'center' }}>
                  <BulletList
                    containerStyle={{ marginTop: -10 }}
                    bulletStyle={s.laBullet}
                    type={'ordered'}
                    items={sermon.lifeApplication.items.map(b => {
                      return <Text style={s.laBulletText}>{b}</Text>;
                    })}
                  />
                </View>
              }
              cardStyle={s.laCardStyle}
            />
            <VideoCard
              header={sermon.videoId}
              // imageSource={{ uri: sermon.video..snippet.thumbnails.high.url }}
              videoId={sermon.videoId}
              onPressVideo={() => setShowVideo(true)}
              showVideo={showVideo}
              playing={!paused}
              onPlayerStateChange={event => {
                setPaused(event === 'paused');
              }}
            />{' '}
          </>
        ) : (
          <Text style={s.notFound}>{'Sermon not found!'}</Text>
        )}
      </ScrollView>
      <EditSermonModal ref={editSermonModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  laHeader: {
    ...theme.styles.textSmall,
    color: theme.colors.whiteTransparentDark,
  },
  laTitle: {
    ...theme.styles.textHeading5,
    color: theme.colors.stickyWhite,
    marginTop: 15,
  },
  laBullet: {
    ...theme.styles.textNormal,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
  laBulletText: {
    ...theme.styles.textNormal,
    color: theme.colors.stickyWhite,
  },
  laCardStyle: {
    paddingBottom: 20,
    marginTop: 35,
    marginBottom: 30,
    backgroundColor: theme.colors.brandPrimary,
    ...theme.styles.viewWidth,
  },
  notFound: {
    ...theme.styles.textNormal,
    textAlign: 'center',
    marginTop: 30,
  },
}));

export default AdminSermonScreen;
