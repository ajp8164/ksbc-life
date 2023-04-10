import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  deleteSermon,
  getSermons,
  sermonsCollectionChangeListener,
} from 'firebase/firestore/sermons';

import { DateTime } from 'luxon';
import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { EditSermonModal } from 'components/admin/modals/EditSermonModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sermon } from 'types/sermon';
import { cacheYouTubeBroadcastVideosToFirestore } from 'lib/youTube';
import { getDocumentCount } from 'firebase/firestore/utils';
import { makeStyles } from '@rneui/themed';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminSermons'>;

const AdminSermonsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const editSermonModalRef = useRef<EditSermonModal>(null);

  const [havePasteurs, setHavePasteurs] = useState(false);
  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  useState<FirebaseFirestoreTypes.DocumentData>();
  const [sermons, setSermons] = useState<Sermon[]>([]);

  useEffect(() => {
    cacheYouTubeBroadcastVideosToFirestore(); //  TESTING
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

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const c = await getDocumentCount('Pasteurs');
      setHavePasteurs(c > 0);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <>
            <Button
              type={'clear'}
              icon={
                <Icon
                  name="plus"
                  type={'material-community'}
                  color={theme.colors.brandSecondary}
                  size={28}
                />
              }
              disabled={!havePasteurs}
              disabledStyle={theme.styles.buttonClearDisabled}
              onPress={() => editSermonModalRef.current?.present('New Sermon')}
            />
          </>
        ),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [havePasteurs]);

  const confirmDeleteSermon = async (id: string) => {
    Alert.alert(
      'Confirm Delete Sermon',
      'Are you sure you want to delete this sermon?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deleteSermon(id),
          style: 'destructive',
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  const renderSermon: ListRenderItem<Sermon> = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.title}
        subtitle={DateTime.fromISO(item.date).toFormat('MMM d, yyyy')}
        value={
          item.video?.id.videoId ? (
            <Icon
              name="youtube"
              type={'material-community'}
              color={theme.colors.lightGray}
              size={28}
            />
          ) : (
            <></>
          )
        }
        position={[
          index === 0 ? 'first' : undefined,
          index === sermons.length - 1 ? 'last' : undefined,
        ]}
        leftImage={'cross-outline'}
        leftImageType={'material-community'}
        drawerRightItems={[
          {
            width: 60,
            background: theme.colors.assertive,
            style: { paddingHorizontal: 0 },
            customElement: (
              <>
                <Icon
                  name={'delete'}
                  type={'material-community'}
                  color={theme.colors.stickyWhite}
                  size={28}
                />
                <Text style={s.drawerText}>{'Delete'}</Text>
              </>
            ),
            onPress: () => confirmDeleteSermon(item.id || ''),
          },
        ]}
        onPress={() => editSermonModalRef.current?.present('Edit Sermon', item)}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add a sermon'}
        position={['first', 'last']}
        leftImage={'cross-outline'}
        leftImageType={'material-community'}
        onPress={() => editSermonModalRef.current?.present('New Sermon')}
      />
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
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      {havePasteurs ? (
        <FlatList
          data={sermons}
          renderItem={renderSermon}
          keyExtractor={(_item, index) => `${index}`}
          ListEmptyComponent={renderListEmptyComponent}
          ListFooterComponent={renderListFooterComponent}
          ListHeaderComponent={<Divider />}
          contentInsetAdjustmentBehavior={'automatic'}
          showsVerticalScrollIndicator={false}
          onEndReached={getMoreSermons}
          onEndReachedThreshold={0.2}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'automatic'}>
          <Divider
            type={'note'}
            text={'There must be at least one pasteur to create a sermon.'}
          />
          <ListItem
            title={'Add a pasteur'}
            position={['first', 'last']}
            leftImage={'account-outline'}
            leftImageType={'material-community'}
            onPress={() => editPasteurModalRef.current?.present('New Pasteur')}
          />
        </ScrollView>
      )}
      <EditPasteurModal ref={editPasteurModalRef} />
      <EditSermonModal ref={editSermonModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  activityIndicator: {
    marginVertical: 15,
  },
  drawerText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
}));

export default AdminSermonsScreen;
