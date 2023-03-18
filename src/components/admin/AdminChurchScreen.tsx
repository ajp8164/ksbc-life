import { Alert, ScrollView } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import {
  collectionChangeListener,
  documentChangeListener,
} from 'firestore/events';
import { deleteLocation, getLocations } from 'firestore/locations';

import { Church } from 'types/church';
import { EditChurchModal } from 'components/admin/modals/EditChurchModal';
import { EditLocationModal } from 'components/admin/modals/EditLocationModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Location } from 'types/location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

const AdminChurchScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editChurchModalRef = useRef<EditChurchModal>(null);
  const editLocationModalRef = useRef<EditLocationModal>(null);

  const [church, setChurch] = useState<Church>();
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
    const subscription = collectionChangeListener('Locations', () => {
      getMoreLocations();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreLocations = async (limit = 10) => {
    try {
      const l = await getLocations(limit, lastDocument);
      setLastDocument(l.lastDocument);
      setLocations(l.locations);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty
    } catch (e: any) {}
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

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
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
        {locations.length ? (
          <>
            {locations
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((location, index) => {
                return (
                  <ListItem
                    key={index}
                    title={location.name}
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
                        onPress: () => confirmDeleteLocation(location.id || ''),
                      },
                    ]}
                    onPress={() =>
                      editLocationModalRef.current?.present(
                        'Edit Location',
                        location,
                      )
                    }
                  />
                );
              })}
          </>
        ) : (
          <ListItem
            title={'Add a church location'}
            position={['first', 'last']}
            leftImage={'map-marker-radius-outline'}
            leftImageType={'material-community'}
            onPress={() =>
              editLocationModalRef.current?.present('New Location')
            }
          />
        )}
      </ScrollView>
      <EditChurchModal ref={editChurchModalRef} />
      <EditLocationModal ref={editLocationModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  noLocations: {
    ...theme.styles.textNormal,
  },
  addLocationButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
}));

export default AdminChurchScreen;
