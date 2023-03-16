import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef, useState } from 'react';

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
// import { EditUserModal } from 'components/admin/modals/EditUserModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { UserProfile } from 'types/user';
import { collectionChangeListener } from 'firestore/events';
import { getUsers } from 'firestore/users';
import { useTheme } from 'theme';

const AdminUsersListScreen = () => {
  const theme = useTheme();

  // const editUserModalRef = useRef<EditUserModal>(null);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const subscription = collectionChangeListener('Users', () => {
      getMoreUsers();
    });

    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreUsers = async (limit = 10) => {
    try {
      const u = await getUsers(limit, lastDocument);
      setLastDocument(u.lastDocument);
      setUsers(u.users);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty
    } catch (e: any) {}
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {users.map((user, index) => {
          return (
            <ListItem
              key={index}
              title={user.name}
              subtitle={user.email}
              position={[
                index === 0 ? 'first' : undefined,
                index === users.length - 1 ? 'last' : undefined,
              ]}
              leftImage={'account-outline'}
              leftImageType={'material-community'}
              // onPress={() =>
              //   editUserModalRef.current?.present('Edit User', user)
              // }
            />
          );
        })}
      </ScrollView>
      {/* <EditUserModal ref={editUserModalRef} /> */}
    </SafeAreaView>
  );
};

export default AdminUsersListScreen;
