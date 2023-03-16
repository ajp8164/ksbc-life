import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { Alert, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import { deleteSermon, getSermons } from 'firestore/sermons';

import { CompositeScreenProps } from '@react-navigation/core';
import { DateTime } from 'luxon';
import { EditSermonModal } from 'components/admin/modals/EditSermonModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sermon } from 'types/church';
import { collectionChangeListener } from 'firestore/events';
import { getPasteurs } from 'firestore/church';
import { useTheme } from 'theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminSermonsList'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminSermonsListScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  const editSermonModalRef = useRef<EditSermonModal>(null);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [sermons, setSermons] = useState<Sermon[]>([]);

  useEffect(() => {
    const subscription = collectionChangeListener('Sermons', () => {
      getMoreSermons();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const pasteurs = await getPasteurs();
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
              onPress={() => {
                if (pasteurs.length > 0) {
                  editSermonModalRef.current?.present('Add Sermon');
                } else {
                  Alert.alert(
                    'No Pasteurs Found',
                    'You must setup at least one pasteur to create a sermon.',
                    [{ text: 'OK' }],
                    { cancelable: false },
                  );
                }
              }}
            />
          </>
        ),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreSermons = async (limit = 10) => {
    try {
      const s = await getSermons(limit, lastDocument);
      setLastDocument(s.lastDocument);
      setSermons(s.sermons);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty
    } catch (e: any) {}
  };

  const confirmDeleteSermon = async (id: string) => {
    Alert.alert(
      'Confirm Delete Note',
      'Are you sure you want to delete this pasteur?',
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

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {sermons.map((sermon, index) => {
          return (
            <ListItem
              key={index}
              title={sermon.title}
              subtitle={DateTime.fromISO(sermon.date).toFormat('MMM d, yyyy')}
              position={[
                index === 0 ? 'first' : undefined,
                index === sermons.length - 1 ? 'last' : undefined,
              ]}
              leftImage={'cross-outline'}
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
                  onPress: () => confirmDeleteSermon(sermon.id || ''),
                },
              ]}
              onPress={() =>
                editSermonModalRef.current?.present('Edit Sermon', sermon)
              }
            />
          );
        })}
      </ScrollView>
      <EditSermonModal ref={editSermonModalRef} />
    </SafeAreaView>
  );
};

export default AdminSermonsListScreen;
