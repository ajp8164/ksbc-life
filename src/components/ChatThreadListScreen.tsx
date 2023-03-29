import { AppTheme, useTheme } from 'theme';
import { FlatList, ListRenderItem, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { Avatar } from '@rneui/base';
import { ChatNavigatorParamList } from 'types/navigation';
import { ListItem } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from 'types/user';
import { getUsers } from 'firestore/users';
import { makeStyles } from '@rneui/themed';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatThreadList'
>;

const ChatThreadListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>();

  useEffect(() => {
    setIsLoading(true);
    getUsers().then(users => {
      setIsLoading(false);
      return setUsers(users.result);
    });
  }, []);

  const renderUser: ListRenderItem<UserProfile> = ({ item, index }) => {
    if (!users || !item.id) return null;
    const threadId = item.id;
    return (
      <ListItem
        title={item.name}
        titleStyle={{ marginLeft: 10 }}
        leftImage={
          <Avatar
            source={{ uri: item.photoUrl }}
            imageProps={{ resizeMode: 'contain' }}
            avatarStyle={{ borderRadius: 30, paddingRight: 5 }}
          />
        }
        position={[
          index === 0 ? 'first' : undefined,
          index === users.length - 1 ? 'last' : undefined,
        ]}
        onPress={() =>
          navigation.navigate('ChatThread', {
            threadId,
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
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {},
}));

export default ChatThreadListScreen;
