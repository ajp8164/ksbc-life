import { AppTheme, useTheme } from 'theme';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'lib/auth';
import { DateTime } from 'luxon';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SermonsNavigatorParamList } from 'types/navigation';
import VideoCard from 'components/molecules/VideoCard';
import { YouTubeVideo } from 'types/youTube';
import { collectionChangeListener } from 'firestore/events';
import { getVideos } from 'firestore/youTube';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'Sermons'
>;

const SermonsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);

  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const [showVideo, setShowVideo] = useState<string | undefined>(undefined);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const subscription = collectionChangeListener('YouTubeVideos', () => {
      getMoreSermons();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreSermons = async (limit = 3) => {
    try {
      setIsLoading(true);
      const v = await getVideos(limit, lastDocument);
      setLastDocument(v.lastDocument);
      setVideos(([] as YouTubeVideo[]).concat(v.videos, videos));
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty
    } catch (e: any) {}
  };

  const renderSermon: ListRenderItem<GoogleApiYouTubeSearchResource> = ({
    item,
  }) => {
    const date = DateTime.fromISO(item.snippet.publishedAt)
      .minus({ day: 1 }) // Videos posted 1 day after recording
      .toFormat('MMM d, yyyy');
    const videoShown = showVideo === item.id.videoId;
    return (
      <View style={s.playerContainer}>
        <VideoCard
          header={'John 2:13-25 | Jamie Auton'}
          title={item.snippet.title}
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
              label: 'Notes',
              icon: 'note-edit-outline',
              iconType: 'material-community',
              onPress: () => {
                // Require user authentication for this feature.
                if (auth.userIsAuthenticated) {
                  navigation.navigate('SermonDetail', {
                    id: item.id.videoId,
                  });
                } else {
                  auth.presentSignInModal('Please sign in to take notes.');
                }
              },
            },
          ]}
        />
      </View>
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={s.emptyListContainer}>
        <Text style={theme.styles.textNormal}>{'No sermons yet'}</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView
        edges={['left', 'right', 'top']}
        style={[theme.styles.view, { paddingHorizontal: 0 }]}>
        <FlatList
          data={videos}
          renderItem={renderSermon}
          ListEmptyComponent={renderListEmptyComponent}
          keyExtractor={item => item.etag}
          onEndReachedThreshold={0.2}
          onEndReached={() => getMoreSermons()}
          contentContainerStyle={{
            paddingVertical: 15,
            ...theme.styles.viewWidth,
          }}
          contentInsetAdjustmentBehavior={'automatic'}
        />
      </SafeAreaView>
    </>
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
