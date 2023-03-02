import { Alert, FlatList, ListRenderItem, Text, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@rneui/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServicesNavigatorParamList } from 'types/navigation';
import YoutubePlayer from 'react-native-youtube-iframe';
import { makeStyles } from '@rneui/themed';
import { saveSermonVideos } from 'store/slices/videos';
import { selectSermonVideos } from 'store/selectors/videos';
import { viewport } from '@react-native-ajp-elements/ui';
import { youTubeBroadcastVideos } from 'lib/youTube';

export type Props = NativeStackScreenProps<
  ServicesNavigatorParamList,
  'Services'
>;

const ServicesScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);
  const dispatch = useDispatch();

  const playerWidth = viewport.width - 30;
  const playerHeight = (playerWidth * 9) / 16;

  const storedVideos = useSelector(selectSermonVideos);

  const allLoaded = useRef(false);
  const nextPageToken = useRef('');
  const [videos, setVideos] =
    useState<GoogleApiYouTubeSearchResource[]>(storedVideos);
  console.log('videos', videos);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

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
          console.log(data);
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
    return <Text>{item.snippet.title}</Text>;
    // return (
    //   <View>
    //     <YoutubePlayer
    //       height={playerHeight}
    //       width={playerWidth}
    //       play={playing}
    //       videoId={'iee2TATGMyI'}
    //       onChangeState={onStateChange}
    //       webViewStyle={{ borderRadius: 15, borderWidth: 1 }}
    //     />
    //     <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
    //   </View>
    // );
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
}));

export default ServicesScreen;
