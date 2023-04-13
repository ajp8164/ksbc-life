import { AppTheme, useTheme } from 'theme';
import { Avatar, Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getUsers,
  usersCollectionChangeListener,
} from 'firebase/firestore/users';

import { AuthContext } from 'lib/auth';
import { ChatNavigatorParamList } from 'types/navigation';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from 'types/user';
import { UserRole } from 'types/user';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThreadList'
>;

const ChatThreadListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          type={'clear'}
          icon={
            <Icon
              name="square-edit-outline"
              type={'material-community'}
              color={theme.colors.brandSecondary}
              size={28}
            />
          }
          onPress={() => navigation.navigate('ChatThread', {})}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = usersCollectionChangeListener(
      snapshot => {
        const updated: UserProfile[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as UserProfile);
        });
        setUsers(filterUsers(updated));
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
      setUsers(filterUsers(users.concat(s.result)));
      allLoaded.current = s.allLoaded;
      setIsLoading(false);
    }
  };

  const filterUsers = (users: UserProfile[]) => {
    return users.filter(u => u.role !== UserRole.Anonymous);
  };

  const renderUser: ListRenderItem<UserProfile> = ({ item, index }) => {
    const recipient = item;
    if (!users || !recipient.id || recipient.role === UserRole.Anonymous) {
      return null;
    }
    return (
      <ListItem
        title={recipient.name || recipient.email}
        leftImage={
          recipient.photoUrl ? (
            <Avatar
              source={{ uri: recipient.photoUrl }}
              imageProps={{ resizeMode: 'contain' }}
              containerStyle={theme.styles.avatar}
            />
          ) : (
            <Avatar
              title={recipient?.avatar.title}
              titleStyle={[theme.styles.avatarTitle]}
              containerStyle={{
                ...theme.styles.avatar,
                backgroundColor: recipient?.avatar.color,
              }}
            />
          )
        }
        position={[
          index === 0 ? 'first' : undefined,
          index === users.length - 1 ? 'last' : undefined,
        ]}
        onPress={() =>
          navigation.navigate('ChatThread', {
            recipient,
          })
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={s.emptyListContainer}>
        <NoItems title={'No messages yet'} />
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      {userProfile?.role !== UserRole.Anonymous ? (
        <FlatList
          data={users}
          renderItem={renderUser}
          ListEmptyComponent={renderListEmptyComponent}
          keyExtractor={item => `${item.id}`}
          contentContainerStyle={{
            paddingVertical: 15,
            ...theme.styles.viewHorizontalInset,
          }}
          contentInsetAdjustmentBehavior={'automatic'}
          onEndReached={getMoreUsers}
          onEndReachedThreshold={0.2}
        />
      ) : (
        <ScrollView
          style={theme.styles.view}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'automatic'}>
          <InfoMessage text={'Please sign in to use chat.'} />
          <Divider />
          <ListItem
            title={'Sign In or Sign Up'}
            leftImage={'account-circle-outline'}
            leftImageType={'material-community'}
            position={['first', 'last']}
            onPress={() => auth.presentSignInModal()}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {},
}));

export default ChatThreadListScreen;
