import { AppTheme, useTheme } from 'theme';
import { FlatList, ListRenderItem, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getSermons, sermonsCollectionChangeListener } from 'firestore/sermons';

import { AuthContext } from 'lib/auth';
import { DateTime } from 'luxon';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sermon } from 'types/sermon';
import { SermonsNavigatorParamList } from 'types/navigation';
import VideoCard from 'components/molecules/VideoCard';
import { bibleReferenceToString } from 'lib/bible';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  SermonsNavigatorParamList,
  'Sermons'
>;

const SermonsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showVideo, setShowVideo] = useState<string | undefined>(undefined);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const subscription = sermonsCollectionChangeListener(
      snapshot => {
        const updated: Sermon[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Sermon);
        });
        setSermons(updated);
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
  }, []);

  const getMoreSermons = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const s = await getSermons({ lastDocument: lastDocument.current });
      lastDocument.current = s.lastDocument;
      setSermons(sermons.concat(s.result));
      allLoaded.current = s.allLoaded;
      setIsLoading(false);
    }
  };

  const renderSermon: ListRenderItem<Sermon> = ({ item }) => {
    const date = item.video
      ? DateTime.fromISO(item.video.snippet.publishedAt).toFormat('MMM d, yyyy')
      : '';
    const header =
      bibleReferenceToString(item.bibleReference) +
      (item.bibleReference?.book.length ? ' | ' : '') +
      item.pasteur;
    const footer =
      date + (item.seriesTitle?.length ? ' | ' : '') + item.seriesTitle;
    const videoShown = item.video && showVideo === item.video.id.videoId;
    return (
      <View style={s.playerContainer}>
        <VideoCard
          header={header}
          title={item.title}
          footer={footer}
          imageSource={{
            uri: item.video ? item.video.snippet.thumbnails.high.url : '',
          }}
          videoId={item.video ? item.video.id.videoId : undefined}
          onPressVideo={() => item.video && setShowVideo(item.video.id.videoId)}
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
                    sermon: item,
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
        <NoItems title={'No sermons yet'} />
      </View>
    );
  };

  return (
    <>
      <SafeAreaView
        edges={['left', 'right', 'top']}
        style={[theme.styles.view, { paddingHorizontal: 0 }]}>
        <FlatList
          data={sermons}
          renderItem={renderSermon}
          ListEmptyComponent={renderListEmptyComponent}
          keyExtractor={item => `${item.date}${item.title}`}
          onEndReachedThreshold={0.2}
          onEndReached={() => getMoreSermons()}
          contentContainerStyle={{
            paddingVertical: 15,
            ...theme.styles.viewHorizontalInset,
          }}
          contentInsetAdjustmentBehavior={'automatic'}
        />
      </SafeAreaView>
    </>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {},
  playerContainer: {
    marginBottom: 10,
  },
}));

export default SermonsScreen;
