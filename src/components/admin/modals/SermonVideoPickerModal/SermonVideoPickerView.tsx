import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Divider, ListItemCheckbox } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  getSermonVideos,
  sermonVideosCollectionChangeListener,
} from 'firebase/firestore/sermonVideos';

import { DateTime } from 'luxon';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { SermonVideo } from 'types/sermon';
import { makeStyles } from '@rneui/themed';

interface SermonVideoPickerInterface {
  onChange: (sermonVideo: SermonVideo) => void;
  value?: SermonVideo;
}

const SermonVideoPickerView = ({
  onChange,
  value,
}: SermonVideoPickerInterface) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();

  const [sermonVideos, setSermonVideos] = useState<SermonVideo[]>([]);
  const [selected, setSelected] = useState<SermonVideo | undefined>(value);

  useEffect(() => {
    const subscription = sermonVideosCollectionChangeListener(
      snapshot => {
        const updated: SermonVideo[] = [];
        snapshot.docs.forEach(d => {
          updated.push(d.data() as SermonVideo);
        });
        setSermonVideos(updated);
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
  }, []);

  const getMoreSermonVideos = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const v = await getSermonVideos({ lastDocument: lastDocument.current });
      lastDocument.current = v.lastDocument;
      setSermonVideos(sermonVideos.concat(v.result));
      allLoaded.current = v.allLoaded;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    selected && onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const renderSermonVideo: ListRenderItem<SermonVideo> = ({ item, index }) => {
    return (
      <ListItemCheckbox
        key={index}
        title={item.snippet.title}
        subtitle={DateTime.fromISO(item.snippet.publishedAt).toFormat(
          'MMM d, yyyy',
        )}
        leftImage={'youtube'}
        leftImageType={'material-community'}
        checkedIcon={'check'}
        checkIconType={'material-community'}
        uncheckedIcon={'checkbox-blank-outline'}
        uncheckedColor={theme.colors.transparent}
        checkedColor={theme.colors.brandSecondary}
        checked={item.id.videoId === selected?.id.videoId}
        position={[
          index === 0 ? 'first' : undefined,
          index === sermonVideos.length - 1 ? 'last' : undefined,
        ]}
        onPress={() => setSelected(item)}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={s.emptyListContainer}>
        <Text style={theme.styles.textNormal}>{'No videos yet'}</Text>
      </View>
    );
  };

  const renderListFooterComponent = () => {
    if (isLoading) {
      return (
        <View style={s.activityIndicator}>
          <ActivityIndicator color={theme.colors.brandPrimary} />
        </View>
      );
    } else {
      return <Divider />;
    }
  };

  return (
    <FlatList
      data={sermonVideos}
      renderItem={renderSermonVideo}
      keyExtractor={item => item.id.videoId}
      ListEmptyComponent={renderListEmptyComponent}
      ListFooterComponent={renderListFooterComponent}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.2}
      onEndReached={getMoreSermonVideos}
    />
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {
    alignItems: 'center',
  },
  activityIndicator: {
    marginVertical: 15,
  },
}));

export default SermonVideoPickerView;
