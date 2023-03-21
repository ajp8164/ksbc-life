import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
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
import { makeStyles } from '@rneui/themed';
import { pasteursCollectionChangeListener } from 'firestore/pasteurs';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminPasteurs'>;

const AdminPasteursScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editPasteurModalRef = useRef<EditPasteurModal>(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [pasteurs, setPasteurs] = useState<Pasteur[]>([]);

  useEffect(() => {
    const subscription = pasteursCollectionChangeListener(
      snapshot => {
        const updated: Pasteur[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Pasteur);
        });
        setPasteurs(updated);
        setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
        setAllLoaded(false);
      },
      { lastDocument },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMorePasteurs = async () => {
    if (!allLoaded) {
      setIsLoading(true);
      const s = await getPasteurs({ lastDocument });
      setLastDocument(s.lastDocument);
      setPasteurs(pasteurs.concat(s.result));
      setAllLoaded(s.allLoaded);
      setIsLoading(false);
    }
  };

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

  const renderPasteur: ListRenderItem<Pasteur> = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={`${item.firstName} ${item.lastName}`}
        subtitle={item.title ? item.title : undefined}
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
            onPress: () => confirmDeletePasteur(item.id || ''),
          },
        ]}
        onPress={() =>
          editPasteurModalRef.current?.present('Edit Pasteur', item)
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add a pasteur'}
        position={['first', 'last']}
        leftImage={'cross-outline'}
        leftImageType={'material-community'}
        onPress={() => editPasteurModalRef.current?.present('New Pasteur')}
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
      <FlatList
        data={pasteurs}
        renderItem={renderPasteur}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={<Divider />}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
        onEndReached={getMorePasteurs}
        onEndReachedThreshold={0.2}
      />
      <EditPasteurModal ref={editPasteurModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  activityIndicator: {
    marginVertical: 15,
  },
}));

export default AdminPasteursScreen;
