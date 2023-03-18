import { Alert, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import { deletePasteur, getPasteurs } from 'firestore/pasteurs';

import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pasteur } from 'types/pasteur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collectionChangeListener } from 'firestore/events';
import { useTheme } from 'theme';

type Props = NativeStackScreenProps<
  MoreNavigatorParamList,
  'AdminPasteursList'
>;

const AdminPasteursListScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [pasteurs, setPasteurs] = useState<Pasteur[]>([]);

  useEffect(() => {
    const subscription = collectionChangeListener('Pasteurs', () => {
      getMorePasteurs();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
            onPress={() => editPasteurModalRef.current?.present('New Pasteur')}
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMorePasteurs = async (limit = 10) => {
    try {
      const p = await getPasteurs(limit, lastDocument);
      setLastDocument(p.lastDocument);
      setPasteurs(p.pasteurs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty
    } catch (e: any) {}
  };

  const confirmDeletePasteur = async (id: string) => {
    Alert.alert(
      'Confirm Delete Pasteur',
      'Are you sure you want to delete this pasteur?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deletePasteur(id),
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
        {pasteurs.length ? (
          <>
            {pasteurs
              .sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
              .map((pasteur, index) => {
                return (
                  <ListItem
                    key={index}
                    title={`${pasteur.firstName} ${pasteur.lastName}`}
                    subtitle={pasteur.title ? pasteur.title : undefined}
                    position={[
                      index === 0 ? 'first' : undefined,
                      index === pasteurs.length - 1 ? 'last' : undefined,
                    ]}
                    leftImage={'account-outline'}
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
                        onPress: () => confirmDeletePasteur(pasteur.id || ''),
                      },
                    ]}
                    onPress={() =>
                      editPasteurModalRef.current?.present(
                        'Edit Pasteur',
                        pasteur,
                      )
                    }
                  />
                );
              })}
          </>
        ) : (
          <ListItem
            title={'Add a pasteur'}
            position={['first', 'last']}
            leftImage={'account-outline'}
            leftImageType={'material-community'}
            onPress={() => editPasteurModalRef.current?.present('New Pasteur')}
          />
        )}
      </ScrollView>
      <EditPasteurModal ref={editPasteurModalRef} />
    </SafeAreaView>
  );
};

export default AdminPasteursListScreen;
