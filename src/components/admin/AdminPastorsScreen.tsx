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
  deletePastor,
  getPastors,
  pastorsCollectionChangeListener,
} from 'firebase/firestore';

import { EditPastorModal } from 'components/admin/modals/EditPastorModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pastor } from 'types/pastor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeStyles } from '@rneui/themed';

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminPastors'>;

const AdminPastorsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editPastorModalRef = useRef<EditPastorModal>(null);
  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  const [pastors, setPastors] = useState<Pastor[]>([]);

  useEffect(() => {
    const subscription = pastorsCollectionChangeListener(
      snapshot => {
        const updated: Pastor[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Pastor);
        });
        setPastors(updated);
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
  }, []);

  const getMorePastors = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const s = await getPastors({ lastDocument: lastDocument.current });
      lastDocument.current = s.lastDocument;
      setPastors(pastors.concat(s.result));
      allLoaded.current = s.allLoaded;
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
            onPress={() => editPastorModalRef.current?.present('New Pastor')}
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDeletePastor = async (id: string) => {
    Alert.alert(
      'Confirm Delete Pastor',
      'Are you sure you want to delete this pastor?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deletePastor(id),
          style: 'destructive',
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  const renderPastor: ListRenderItem<Pastor> = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={`${item.firstName} ${item.lastName}`}
        subtitle={item.title ? item.title : undefined}
        position={[
          index === 0 ? 'first' : undefined,
          index === pastors.length - 1 ? 'last' : undefined,
        ]}
        leftImage={'account-outline'}
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
            onPress: () => confirmDeletePastor(item.id || ''),
          },
        ]}
        onPress={() =>
          editPastorModalRef.current?.present('Edit Pastor', item)
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add a pastor'}
        position={['first', 'last']}
        leftImage={'cross-outline'}
        leftImageType={'material-community'}
        onPress={() => editPastorModalRef.current?.present('New Pastor')}
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
      <FlatList
        data={pastors}
        renderItem={renderPastor}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={<Divider />}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
        onEndReached={getMorePastors}
        onEndReachedThreshold={0.2}
      />
      <EditPastorModal ref={editPastorModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  activityIndicator: {
    marginVertical: 15,
  },
  drawerText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
}));

export default AdminPastorsScreen;
