import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import { ExtendedGroup, Group } from 'types/group';
import { FlatList, ListRenderItem, ScrollView, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { calculateGroupName, getGroupUserProfiles } from 'lib/group';

import { AuthContext } from 'lib/auth';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { ChatNavigatorParamList } from 'types/navigation';
import { DateTime } from 'luxon';
import InfoMessage from 'components/atoms/InfoMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NoItems from 'components/atoms/NoItems';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRelativeDate } from 'lib/relativeDate';
import { groupsCollectionChangeListener } from 'firebase/firestore';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';

export type Props = NativeStackScreenProps<
  ChatNavigatorParamList,
  'ChatGroups'
>;

const ChatGroupsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const auth = useContext(AuthContext);
  const myUserProfile = useSelector(selectUserProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [exGroups, setExGroups] = useState<ExtendedGroup[]>([]);

  // Set header
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
          onPress={() =>
            navigation.navigate('ChatThread', { myGroups: exGroups })
          }
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exGroups]);

  // Groups collection listener
  useEffect(() => {
    // Clear state in anticipation of another sign in without restating the app.
    // Prevents the new user from accessing the old users data.
    setExGroups([]);

    const subscription = groupsCollectionChangeListener(
      async snapshot => {
        if (snapshot.docChanges().length === 0) return;

        const updated: Group[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as Group);
        });
        prepareGroups(updated).then(exGroups => {
          setExGroups(exGroups);
          isLoading ? setIsLoading(false) : null;
        });
      },
      {
        where: [
          {
            fieldPath: 'members',
            opStr: 'array-contains',
            value: myUserProfile?.id,
          },
        ],
        auth: { userRole: myUserProfile?.role },
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserProfile?.role]);

  const prepareGroups = async (groups: Group[]): Promise<ExtendedGroup[]> => {
    const exGroups = await Promise.all(
      groups.map(async g => {
        const groupUserProfiles = await getGroupUserProfiles(g.members);
        const exGroup = { ...g, extended: { groupUserProfiles } };
        calculateGroupName(exGroup);
        return exGroup;
      }),
    );

    // Sort by latest message time.
    return (
      exGroups
        .sort((a, b) => {
          return a.latestMessageSnippet?.createdAt &&
            b.latestMessageSnippet?.createdAt
            ? DateTime.fromISO(b.latestMessageSnippet.createdAt).toMillis() -
                DateTime.fromISO(a.latestMessageSnippet.createdAt).toMillis()
            : 0;
        })
        // Sort unread groups to the top.
        .sort((a, b) => {
          return b.latestMessageSnippet?.readBy.includes(
            myUserProfile?.id || '',
          ) && !a.latestMessageSnippet?.readBy.includes(myUserProfile?.id || '')
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
        title={group.extended?.calculatedName}
        titleStyle={s.title}
        titleNumberOfLines={1}
        subtitle={group.latestMessageSnippet?.text}
        subtitleStyle={s.subtitle}
        subtitleNumberOfLines={2}
        value={
          group.latestMessageSnippet?.createdAt &&
          getRelativeDate(group.latestMessageSnippet?.createdAt)
        }
        valueStyle={[theme.styles.textSmall, theme.styles.textDim]}
        alignContent={'top'}
        leftImage={
          <View
            style={{
              borderColor:
                myUserProfile?.id &&
                !group.latestMessageSnippet?.readBy.includes(myUserProfile.id)
                  ? theme.colors.brandSecondary
                  : theme.colors.transparent,
              borderWidth: 3,
              borderRadius: 50,
              padding: 2,
              marginLeft: -5,
            }}>
            <ChatAvatar group={group} size={'medium'} />
          </View>
        }
        position={[
          index === 0 ? 'first' : undefined,
          index === exGroups.length - 1 ? 'last' : undefined,
        ]}
        onPress={() => navigation.navigate('ChatThread', { group })}
      />
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={s.emptyListContainer}>
        {isLoading ? <NoItems isLoading /> : <NoItems title={'No groups'} />}
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[theme.styles.view, { paddingHorizontal: 0 }]}>
      {myUserProfile ? (
        <FlatList
          data={exGroups}
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
  emptyListContainer: {
    marginTop: '50%',
  },
  title: {
    left: 20,
    width: '78%',
  },
  subtitle: {
    left: 20,
  },
}));

export default ChatGroupsScreen;
