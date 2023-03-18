import { Alert, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import { deleteSermon, getSermons } from 'firestore/sermons';

import { DateTime } from 'luxon';
import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { EditSermonModal } from 'components/admin/modals/EditSermonModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sermon } from 'types/church';
import { collectionChangeListener } from 'firestore/events';
// import { getDocumentCount } from 'firestore/utils';
import { useTheme } from 'theme';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminSermonsList'>;

const AdminSermonsListScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const editSermonModalRef = useRef<EditSermonModal>(null);

  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [pasteurCount, setPasteurCount] = useState(0);

  useEffect(() => {
    const subscription = collectionChangeListener('Sermons', () => {
      getMoreSermons();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = collectionChangeListener('Pasteurs', async snapshot =>
      setPasteurCount(snapshot.size),
    );

    return subscription;
  }, []);

  useEffect(() => {
    (async () => {
      // const count = await getDocumentCount('Pasteurs');
      // setPasteurCount(count);
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
              disabled={pasteurCount === 0}
              disabledStyle={theme.styles.buttonClearDisabled}
              onPress={() => editSermonModalRef.current?.present('New Sermon')}
            />
          </>
        ),
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasteurCount]);

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
        {pasteurCount > 0 ? (
          sermons.length ? (
            <>
              <Divider />
              {sermons.map((sermon, index) => {
                return (
                  <ListItem
                    key={index}
                    title={sermon.title}
                    subtitle={DateTime.fromISO(sermon.date).toFormat(
                      'MMM d, yyyy',
                    )}
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
            </>
          ) : (
            <>
              <Divider />
              <ListItem
                title={'Add a sermon'}
                position={['first', 'last']}
                leftImage={'cross-outline'}
                leftImageType={'material-community'}
                onPress={() =>
                  editSermonModalRef.current?.present('New Sermon')
                }
              />
            </>
          )
        ) : (
          <>
            <Divider
              type={'note'}
              text={'There msut be at least one pasteur to create a sermon.'}
            />
            <ListItem
              title={'Add a pasteur'}
              position={['first', 'last']}
              leftImage={'account-outline'}
              leftImageType={'material-community'}
              onPress={() =>
                editPasteurModalRef.current?.present('New Pasteur')
              }
            />
          </>
        )}
      </ScrollView>
      <EditPasteurModal ref={editPasteurModalRef} />
      <EditSermonModal ref={editSermonModalRef} />
    </SafeAreaView>
  );
};

export default AdminSermonsListScreen;
