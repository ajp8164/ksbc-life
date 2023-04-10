import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  Text,
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
} from 'firebase/firestore/locations';

import { Church } from 'types/church';
import { EditChurchModal } from 'components/admin/modals/EditChurchModal';
import { EditLocationModal } from 'components/admin/modals/EditLocationModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Location } from 'types/location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { churchCollectionChangeListener } from 'firebase/firestore/churches';
import { makeStyles } from '@rneui/themed';

const AdminChurchScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const contentTop = theme.styles.headerBarLarge.height as number;

  const editChurchModalRef = useRef<EditChurchModal>(null);
  const editLocationModalRef = useRef<EditLocationModal>(null);

  const [church, setChurch] = useState<Church>();
  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const subscription = churchCollectionChangeListener(
      snapshot => {
        const updated: Church[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Church);
        });
        setChurch(updated[0]); // Single church at the moment
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
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
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
  }, []);

  const getMoreLocations = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const s = await getLocations({ lastDocument: lastDocument.current });
      lastDocument.current = s.lastDocument;
      setLocations(locations.concat(s.result));
      allLoaded.current = s.allLoaded;
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
          <ActivityIndicator color={theme.colors.brandPrimary} />
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
          title={church?.name || 'Setup my church'}
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
        showsVerticalScrollIndicator={false}
        onEndReached={getMoreLocations}
        onEndReachedThreshold={0.2}
      />
      <EditChurchModal ref={editChurchModalRef} />
      <EditLocationModal ref={editLocationModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  addLocationButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  activityIndicator: {
    marginVertical: 15,
  },
  drawerText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
}));

export default AdminChurchScreen;
