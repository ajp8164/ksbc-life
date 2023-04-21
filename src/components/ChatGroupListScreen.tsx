import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider } from '@react-native-ajp-elements/ui';
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'lib/auth';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ChatNavigatorParamList } from 'types/navigation';
import { DateTime } from 'luxon';
import { Group } from 'types/group';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserRole } from 'types/user';
import { getGroupName } from 'lib/group';
import { groupsCollectionChangeListener } from 'firebase/firestore/groups';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { ListItem } from 'components/atoms/ListItem';

type ExtendedGroup = Group & { calculatedName: string };

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatGroupList'
>;

const ChatGroupListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const userProfile = useSelector(selectUserProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<ExtendedGroup[]>([]);

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
          onPress={() => navigation.navigate('ChatGroup', {})}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = groupsCollectionChangeListener(
      snapshot => {
        if (snapshot.docChanges().length === 0) return;

        const updated: Group[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Group);
        });
        setGroups(prepareGroups(updated));
        isLoading ? setIsLoading(false) : null;
      },
      {
        where: [
          {
            fieldPath: 'members',
            opStr: 'array-contains',
            value: userProfile?.id,
          },
        ],
        auth: { userRole: userProfile?.role },
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile?.role]);

  const prepareGroups = (groups: Group[]): ExtendedGroup[] => {
    return (
      (groups as ExtendedGroup[])
        .map(g => {
          return {
            ...g,
            calculatedName: getGroupName(g),
          };
        })
        // Sort groups alphabetically.
        .sort((a, b) => {
          return a.calculatedName.toLowerCase() < b.calculatedName.toLowerCase()
            ? -1
            : 1;
        })
        // Sort unread groups to the top.
        .sort((a, b) => {
          return b.latestMessageSnippet?.readBy.includes(
            userProfile?.id || '',
          ) && !a.latestMessageSnippet?.readBy.includes(userProfile?.id || '')
            ? -1
            : 1;
        })
    );
  };

  const renderGroup: ListRenderItem<ExtendedGroup> = ({
    item: group,
    index,
  }) => {
    return (
      <ListItem
        title={group.calculatedName}
        titleStyle={s.title}
        subtitle={group.latestMessageSnippet?.text}
        subtitleStyle={s.subtitle}
        numberOfLines={2}
        value={
          group.latestMessageSnippet?.createdAt &&
          DateTime.fromISO(group.latestMessageSnippet?.createdAt).toFormat(
            'M/d/yy',
          )
        }
        valueStyle={[theme.styles.textSmall, theme.styles.textDim]}
        alignContent={'top'}
        leftImage={
          <View style={{ flexDirection: 'row' }}>
            <ChatAvatar group={group} size={'medium'} />
            {userProfile?.id &&
              !group.latestMessageSnippet?.readBy.includes(userProfile.id) && (
                <Icon
                  name={'circle'}
                  type={'material-community'}
                  color={theme.colors.assertive}
                  size={16}
                  containerStyle={{ position: 'absolute', right: 0, bottom: 0 }}
                />
              )}
          </View>
        }
        position={[
          index === 0 ? 'first' : undefined,
          index === groups.length - 1 ? 'last' : undefined,
        ]}
        onPress={() =>
          navigation.navigate('ChatGroup', {
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
  title: {
    left: 20,
  },
  subtitle: {
    left: 20,
  },
}));

export default ChatGroupListScreen;
