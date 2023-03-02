import { Alert, FlatList, ListRenderItem, Text, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DateTime } from 'luxon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SermonsNavigatorParamList } from 'types/navigation';
import VideoCard from 'components/molecules/VideoCard';
// import YoutubePlayer from 'react-native-youtube-iframe';
import { makeStyles } from '@rneui/themed';
import { saveSermonVideos } from 'store/slices/videos';
import { selectSermonVideos } from 'store/selectors/videos';
import { youTubeBroadcastVideos } from 'lib/youTube';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'Sermons'
>;

const SermonsScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const storedVideos = useSelector(selectSermonVideos);

  const allLoaded = useRef(false);
  const nextPageToken = useRef('');
  const [videos, setVideos] =
    useState<GoogleApiYouTubeSearchResource[]>(storedVideos);
  const [showVideo, setShowVideo] = useState<string | undefined>(undefined);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(saveSermonVideos({ videos }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);

  const removeDuplicateVideos = (videos: GoogleApiYouTubeSearchResource[]) => {
    return Array.from(new Set(videos.map(v => v.id.videoId))).map(videoId => {
      return videos.find(
        v => v.id.videoId === videoId,
      ) as GoogleApiYouTubeSearchResource;
    });
  };

  const fetchVideos = () => {
    if (!allLoaded.current) {
      youTubeBroadcastVideos(nextPageToken.current)
        .then(data => {
          if (
            data.pageInfo.totalResults !== videos.length &&
            data.nextPageToken
          ) {
            nextPageToken.current = data.nextPageToken;
            setVideos(removeDuplicateVideos(videos.concat(data.items)));
          } else {
            allLoaded.current = true;
          }
        })
        .catch(() => {
          Alert.alert(
            'Video Loading Error',
            'There was a problem loading videos. Please try again later.',
            [{ text: 'OK' }],
            {
              cancelable: false,
            },
          );
        });
    }
  };

  const renderVideo: ListRenderItem<GoogleApiYouTubeSearchResource> = ({
    item,
  }) => {
    const date = DateTime.fromISO(item.snippet.publishedAt)
      .minus({ day: 1 }) // Videos posted 1 day after recording
      .toFormat('MMM d, yyyy');
    const videoShown = showVideo === item.id.videoId;
    return (
      <View style={s.playerContainer}>
        <VideoCard
          header={'John 3 | Jamie Auton'}
          title={'Plan Ahead'}
          footer={`${date} | Series: Book of John`}
          imageSource={{ uri: item.snippet.thumbnails.high.url }}
          videoId={item.id.videoId}
          onPressVideo={() => setShowVideo(item.id.videoId)}
          showVideo={videoShown}
          playing={!paused}
          onPlayerStateChange={event => {
            setPaused(event === 'paused');
          }}
          buttons={[
            ...(videoShown
              ? [
                  {
                    label: paused ? 'Play' : 'Pause',
                    icon: paused ? 'play' : 'pause',
                    iconType: 'material-community',
                    onPress: () => setPaused(!paused),
                  },
                  {
                    label: 'Stop',
                    icon: 'stop',
                    iconType: 'material-community',
                    onPress: () => {
                      setShowVideo(undefined);
                      setPaused(false);
                    },
                  },
                ]
              : []),
            {
              label: 'About this sermon',
              icon: 'information-outline',
              iconType: 'material-community',
              onPress: () => {
                console.log('about');
              },
            },
          ]}
        />
      </View>
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={s.emptyListContainer}>
        <Text style={theme.styles.textNormal}>{'No videos yet'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={theme.styles.view}>
      <FlatList
        data={videos}
        renderItem={renderVideo}
        ListEmptyComponent={renderListEmptyComponent}
        keyExtractor={item => item.etag}
        onEndReachedThreshold={0.2}
        onEndReached={fetchVideos}
        contentContainerStyle={{ paddingVertical: 15 }}
        contentInsetAdjustmentBehavior={'automatic'}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {
    alignItems: 'center',
  },
  playerContainer: {
    marginBottom: 10,
  },
}));

export default SermonsScreen;
