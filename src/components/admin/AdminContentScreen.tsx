import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
  ShadowDecorator,
} from 'react-native-draggable-flatlist';
import React, { useEffect, useRef, useState } from 'react';
import {
  deleteScreenContentItem,
  getScreenContentItems,
  screenContentItemCollectionChangeListener,
  updateScreenContentItem,
} from 'firestore/screenContentItems';

import { EditScreenContentItemModal } from 'components/admin/modals/EditScreenContentItemModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContentItem } from 'types/screenContentItem';
import { makeStyles } from '@rneui/themed';
import { useHeaderHeight } from '@react-navigation/elements';

const AdminContentScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const headerHeight = useHeaderHeight();
  const iosLargeTitleHeight = theme.styles.iosLargeHeader.height as number;
  const contentTop = headerHeight + iosLargeTitleHeight;

  const editScreenContentItemModalRef =
    useRef<EditScreenContentItemModal>(null);

  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [sortEnabled, setSortEnabled] = useState(false);
  const orderChangeCount = useRef(0);

  const [screenContentItems, setScreenContentItems] = useState<
    ScreenContentItem[]
  >([]);

  useEffect(() => {
    const subscription = screenContentItemCollectionChangeListener(
      snapshot => {
        if (orderChangeCount.current <= 0) {
          const updated: ScreenContentItem[] = [];
          snapshot.docs.forEach(d => {
            updated.push({ ...d.data(), id: d.id } as ScreenContentItem);
          });
          setScreenContentItems(sort(updated));
          setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
          setAllLoaded(false);
        } else {
          orderChangeCount.current--;
        }
      },
      { lastDocument },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreContentItems = async () => {
    if (!allLoaded) {
      setIsLoading(true);
      const s = await getScreenContentItems({ lastDocument });
      setLastDocument(s.lastDocument);
      setScreenContentItems(sort(screenContentItems.concat(s.result)));
      setAllLoaded(s.allLoaded);
      setIsLoading(false);
    }
  };

  const sort = (items: ScreenContentItem[]) => {
    return items.sort((a, b) => {
      return a.ordinal - b.ordinal;
    });
  };

  const onDragEnd = ({ data }: DragEndParams<ScreenContentItem>) => {
    // Keep track of how many items are updated after drag.
    // Use this count to prevent state updates when the collection listener
    // reeives events for these changes. Preventing state updates at the listener
    // prevents excessive re-renders which creates a poor UX.
    orderChangeCount.current = 0;
    data.forEach((item, index) => {
      item.ordinal = index;
      if (item.name !== screenContentItems[index].name) {
        updateScreenContentItem(item);
        orderChangeCount.current++;
      }
    });
    setScreenContentItems(data);
  };

  const archiveScreenContent = (item: ScreenContentItem) => {
    item.status = 'archive';
    updateScreenContentItem(item);
  };

  const confirmDeleteScreenContent = async (id: string) => {
    Alert.alert(
      'Confirm Delete Content',
      'Are you sure you want to delete this content?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deleteScreenContentItem(id),
          style: 'destructive',
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  const renderScreenContentItem = ({
    item,
    getIndex,
    drag,
  }: RenderItemParams<ScreenContentItem>) => {
    const index = getIndex();
    return (
      <ShadowDecorator opacity={0.1} radius={10}>
        <ListItem
          title={item.name}
          position={[
            index === 0 ? 'first' : undefined,
            index === screenContentItems.length - 1 ? 'last' : undefined,
          ]}
          leftImage={'card-text-outline'}
          leftImageType={'material-community'}
          rightImage={
            sortEnabled ? (
              <Icon
                name="drag-horizontal-variant"
                type={'material-community'}
                color={theme.colors.midGray}
                size={24}
              />
            ) : undefined
          }
          onPress={() =>
            !sortEnabled &&
            editScreenContentItemModalRef.current?.present('Edit Content', item)
          }
          onLongPress={drag}
          delayLongPress={300}
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
              onPress: () => confirmDeleteScreenContent(item.id || ''),
            },
            {
              width: 60,
              background: theme.colors.calm,
              style: { paddingHorizontal: 0 },
              customElement: (
                <View style={{}}>
                  <Icon
                    name={'archive'}
                    type={'material-community'}
                    color={theme.colors.stickyWhite}
                    size={28}
                  />
                  <Text
                    style={[
                      theme.styles.textTiny,
                      theme.styles.textBold,
                      { color: theme.colors.stickyWhite },
                    ]}>
                    {'Archive'}
                  </Text>
                </View>
              ),
              onPress: () => archiveScreenContent(item),
            },
          ]}
        />
      </ShadowDecorator>
    );
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add content'}
        position={['first', 'last']}
        leftImage={'card-plus-outline'}
        leftImageType={'material-community'}
        onPress={() =>
          editScreenContentItemModalRef.current?.present('New Content')
        }
      />
    );
  };

  const renderListFooterComponent = () => {
    return (
      <>
        {sortEnabled && (
          <Divider
            text={'Drag items to reorder content.'}
            subHeaderStyle={{ marginTop: 10 }}
          />
        )}
        {isLoading && (
          <View style={s.activityIndicator}>
            <ActivityIndicator color={theme.colors.brandPrimary} />
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <View style={{ marginTop: contentTop, flex: 1 }}>
        <View style={{ justifyContent: 'space-around' }}>
          <Divider
            text={'HOME ANNOUNCEMENTS'}
            rightComponent={
              <View style={{ flexDirection: 'row' }}>
                <Button
                  type={'clear'}
                  buttonStyle={s.addAnnouncementButton}
                  containerStyle={{ marginRight: 10, marginTop: 1 }}
                  icon={
                    <Icon
                      name={'sort'}
                      type={'material-community'}
                      color={
                        sortEnabled
                          ? theme.colors.midGray
                          : theme.colors.brandSecondary
                      }
                      size={26}
                    />
                  }
                  onPress={() => setSortEnabled(!sortEnabled)}
                />
                <Button
                  type={'clear'}
                  buttonStyle={s.addAnnouncementButton}
                  icon={
                    <Icon
                      name={'plus'}
                      type={'material-community'}
                      color={theme.colors.brandSecondary}
                      size={28}
                    />
                  }
                  onPress={() =>
                    editScreenContentItemModalRef.current?.present(
                      'New Content',
                    )
                  }
                />
              </View>
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            keyExtractor={item => `${item.name}${item.ordinal}`}
            showsVerticalScrollIndicator={false}
            data={screenContentItems}
            renderItem={renderScreenContentItem}
            ListEmptyComponent={renderListEmptyComponent}
            ListFooterComponent={renderListFooterComponent}
            style={{ height: '100%' }}
            onDragEnd={onDragEnd}
            onEndReached={getMoreContentItems}
            onEndReachedThreshold={0.2}
            dragHitSlop={sortEnabled ? {} : { left: 0, width: 0 }}
          />
        </View>
      </View>
      <EditScreenContentItemModal ref={editScreenContentItemModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  addAnnouncementButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  activityIndicator: {
    marginVertical: 15,
  },
  drawerText: {
    ...theme.styles.textTiny,
    ...theme.styles.textBold,
    color: theme.colors.stickyWhite,
  },
}));

export default AdminContentScreen;
