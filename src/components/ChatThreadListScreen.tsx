import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { getGroupMembersStr, getGroupName } from 'lib/group';

import { AuthContext } from 'lib/auth';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ChatNavigatorParamList } from 'types/navigation';
import { Group } from 'types/group';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from 'types/user';
import { groupsCollectionChangeListener } from 'firebase/firestore/groups';
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

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);

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
    const subscription = groupsCollectionChangeListener(snapshot => {
      const updated: Group[] = [];
      snapshot.docs.forEach(d => {
        updated.push({ ...d.data(), id: d.id } as Group);
      });
      setGroups(updated);
      isLoading ? setIsLoading(false) : null;
    });
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderGroup: ListRenderItem<Group> = ({ item: group, index }) => {
    return (
      <ListItem
        title={group.name || getGroupName(group)}
        subtitle={
          group.name.length > 0 ? getGroupMembersStr(group.members) : undefined
        }
        leftImage={<ChatAvatar group={group} />}
        position={[
          index === 0 ? 'first' : undefined,
          index === groups.length - 1 ? 'last' : undefined,
        ]}
        onPress={() =>
          navigation.navigate('ChatThread', {
            group,
          })
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={s.emptyListContainer}>
        <NoItems title={'No groups'} />
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      {userProfile?.role !== UserRole.Anonymous ? (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          ListEmptyComponent={renderListEmptyComponent}
          keyExtractor={item => `${item.id}`}
          contentContainerStyle={{
            paddingVertical: 15,
            ...theme.styles.viewHorizontalInset,
          }}
          contentInsetAdjustmentBehavior={'automatic'}
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
