import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';
import { getUsers, usersCollectionChangeListener } from 'firebase/firestore';

import { EditUserModal } from 'components/admin/modals/EditUserModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from 'types/user';
import { makeStyles } from '@rneui/themed';

const AdminUsersScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editUserModalRef = useRef<EditUserModal>(null);
  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  useState<FirebaseFirestoreTypes.DocumentData>();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const subscription = usersCollectionChangeListener(
      snapshot => {
        const updated: UserProfile[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as UserProfile);
        });
        setUsers(updated);
        lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
        allLoaded.current = false;
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
  }, []);

  const getMoreUsers = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const s = await getUsers({ lastDocument: lastDocument.current });
      lastDocument.current = s.lastDocument;
      setUsers(users.concat(s.result));
      allLoaded.current = s.allLoaded;
      setIsLoading(false);
    }
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.name}
        subtitle={item.email}
        position={[
          index === 0 ? 'first' : undefined,
          index === users.length - 1 ? 'last' : undefined,
        ]}
        leftImage={'account-outline'}
        leftImageType={'material-community'}
        onPress={() => editUserModalRef.current?.present('Edit User', item)}
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
        onPress={() => editUserModalRef.current?.present('New User')}
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
        data={users}
        renderItem={renderUser}
        keyExtractor={(_item, index) => `${index}`}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={<Divider />}
        contentInsetAdjustmentBehavior={'automatic'}
        showsVerticalScrollIndicator={false}
        onEndReached={getMoreUsers}
        onEndReachedThreshold={0.2}
      />
      <EditUserModal ref={editUserModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  activityIndicator: {
    marginVertical: 15,
  },
}));

export default AdminUsersScreen;
