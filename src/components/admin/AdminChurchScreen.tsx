import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  Platform,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  deleteLocation,
  getLocations,
  locationsCollectionChangeListener,
} from 'firestore/locations';

import { Church } from 'types/church';
import { EditChurchModal } from 'components/admin/modals/EditChurchModal';
import { EditLocationModal } from 'components/admin/modals/EditLocationModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Location } from 'types/location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { documentChangeListener } from 'firestore/events';
import { makeStyles } from '@rneui/themed';
import { useHeaderHeight } from '@react-navigation/elements';

const AdminChurchScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const headerHeight = useHeaderHeight();
  const iosLargeTitleHeight = Platform.OS === 'ios' ? 52 : 0;
  const contentTop = headerHeight + iosLargeTitleHeight;

  const editChurchModalRef = useRef<EditChurchModal>(null);
  const editLocationModalRef = useRef<EditLocationModal>(null);

  const [church, setChurch] = useState<Church>();
  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const subscription = documentChangeListener(
      'Church',
      'Church',
      documentSnapshot => {
        setChurch(documentSnapshot.data() as Church);
      },
    );
    return subscription;
  }, []);

  useEffect(() => {
    const subscription = locationsCollectionChangeListener(
      snapshot => {
        const updated: Location[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Location);
        });
        setLocations(updated);
        setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
        setAllLoaded(false);
      },
      { lastDocument },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreLocations = async () => {
    if (!allLoaded) {
      setIsLoading(true);
      const s = await getLocations({ lastDocument });
      setLastDocument(s.lastDocument);
      setLocations(locations.concat(s.result));
      setAllLoaded(s.allLoaded);
      setIsLoading(false);
    }
  };

  const confirmDeleteLocation = async (id: string) => {
    Alert.alert(
      'Confirm Delete Location',
      'Are you sure you want to delete this location?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deleteLocation(id),
          style: 'destructive',
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  const renderLocation: ListRenderItem<Location> = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.name}
        position={[
          index === 0 ? 'first' : undefined,
          index === locations.length - 1 ? 'last' : undefined,
        ]}
        leftImage={'map-marker-radius-outline'}
        leftImageType={'material-community'}
        drawerRightItems={[
          {
            width: 50,
            background: theme.colors.assertive,
            customElement: (
              <Icon
                name="delete"
                type={'material-community'}
                color={theme.colors.stickyWhite}
                size={28}
              />
            ),
            onPress: () => confirmDeleteLocation(item.id || ''),
          },
        ]}
        onPress={() =>
          editLocationModalRef.current?.present('Edit Location', item)
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add a church location'}
        position={['first', 'last']}
        leftImage={'map-marker-radius-outline'}
        leftImageType={'material-community'}
        onPress={() => editLocationModalRef.current?.present('New Location')}
      />
    );
  };

  const renderListFooterComponent = () => {
    if (isLoading) {
      return (
        <View style={s.activityIndicator}>
          <ActivityIndicator color={theme.colors.brandPrimary} size={'large'} />
        </View>
      );
    } else {
      return <Divider />;
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <View style={{ marginTop: contentTop }}>
        <Divider />
        <ListItem
          title={church?.name}
          position={['first', 'last']}
          leftImage={'church'}
          leftImageType={'material-community'}
          onPress={() => editChurchModalRef.current?.present(church)}
        />
        <Divider
          text={'LOCATIONS'}
          rightComponent={
            <Button
              type={'clear'}
              buttonStyle={s.addLocationButton}
              icon={
                <Icon
                  name="plus"
                  type={'material-community'}
                  color={theme.colors.brandSecondary}
                  size={28}
                />
              }
              onPress={() =>
                editLocationModalRef.current?.present('New Location')
              }
            />
          }
        />
      </View>
      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
        onEndReached={getMoreLocations}
        onEndReachedThreshold={0.2}
      />
      <EditChurchModal ref={editChurchModalRef} />
      <EditLocationModal ref={editLocationModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  addLocationButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  activityIndicator: {
    marginVertical: 15,
  },
}));

export default AdminChurchScreen;
