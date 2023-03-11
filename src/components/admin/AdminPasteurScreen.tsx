import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@rneui/base';
import { CompositeScreenProps } from '@react-navigation/core';
import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pasteur } from 'types/church';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { documentChangeListener } from 'firestore/events';
import { getPasteur } from 'firestore/church';
import { makeStyles } from '@rneui/themed';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminPasteur'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminPasteurScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [pasteur, setPasteur] = useState<Pasteur>(route.params.pasteur);
  const editPasteurModalRef = useRef<EditPasteurModal>(null);

  useEffect(() => {
    navigation.setOptions({
      title: `${pasteur.firstName || ''} ${pasteur.lastName || ''}`,
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          type={'clear'}
          title={'Edit'}
          onPress={() => editPasteurModalRef.current?.present('Edit Pasteur')}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasteur.firstName, pasteur.lastName]);

  useEffect(() => {
    documentChangeListener('Church', 'Church', () => {
      getPasteur(pasteur.id).then(
        updatedPasteur => updatedPasteur && setPasteur(updatedPasteur),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}
      />
      <EditPasteurModal ref={editPasteurModalRef} pasteur={pasteur} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({}));

export default AdminPasteurScreen;
