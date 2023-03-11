import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';

import { CompositeScreenProps } from '@react-navigation/core';
import { EditPasteurModal } from 'components/admin/modals/EditPasteurModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pasteur } from 'types/church';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { documentChangeListener } from 'firestore/events';
import { getPasteurs } from 'firestore/church';
import { makeStyles } from '@rneui/themed';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminPasteursList'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminPasteursListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const [pasteurs, setPasteurs] = useState<Pasteur[]>([]);

  useEffect(() => {
    const subscription = documentChangeListener('Church', 'Church', () => {
      getPasteurs().then(pasteurs => {
        setPasteurs(pasteurs);
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

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {pasteurs.map((pasteur, index) => {
          return (
            <ListItem
              key={index}
              title={`${pasteur.firstName} ${pasteur.lastName}`}
              position={[
                index === 0 ? 'first' : undefined,
                index === pasteurs.length - 1 ? 'last' : undefined,
              ]}
              // leftImage={'cross-outline'}
              // leftImageType={'material-community'}
              onPress={() =>
                navigation.navigate('AdminPasteur', {
                  pasteur,
                })
              }
            />
          );
        })}
      </ScrollView>
      <EditPasteurModal ref={editPasteurModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
  },
}));

export default AdminPasteursListScreen;