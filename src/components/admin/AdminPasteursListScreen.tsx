import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { Alert, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import { deletePasteur, getPasteurs } from 'firestore/church';

import { CompositeScreenProps } from '@react-navigation/core';
import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pasteur } from 'types/church';
import { SafeAreaView } from 'react-native-safe-area-context';
import { documentChangeListener } from 'firestore/events';
import { useTheme } from 'theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminPasteursList'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminPasteursListScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const [pasteurs, setPasteurs] = useState<Pasteur[]>([]);

  useEffect(() => {
    const subscription = documentChangeListener('Church', 'Church', () => {
      getPasteurs()
        .then(pasteurs => {
          setPasteurs(pasteurs);
        })
        .catch(() => {
          Alert.alert(
            'Could Not Load Pasteurs',
            'Please try again.',
            [{ text: 'OK' }],
            { cancelable: false },
          );
        });
    });

    return subscription;
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
            onPress={() => editPasteurModalRef.current?.present('Add Pasteur')}
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDeletePasteur = async (id: string) => {
    Alert.alert(
      'Confirm Delete Note',
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
        {pasteurs
          .sort((a, b) => (a.lastName > b.lastName ? 1 : -1))
          .map((pasteur, index) => {
            return (
              <ListItem
                key={index}
                title={`${pasteur.firstName} ${pasteur.lastName}`}
                subtitle={pasteur.title}
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
                    onPress: () => confirmDeletePasteur(pasteur.id),
                  },
                ]}
                onPress={() =>
                  editPasteurModalRef.current?.present('Edit Pasteur', pasteur)
                }
              />
            );
          })}
      </ScrollView>
      <EditPasteurModal ref={editPasteurModalRef} />
    </SafeAreaView>
  );
};

export default AdminPasteursListScreen;
