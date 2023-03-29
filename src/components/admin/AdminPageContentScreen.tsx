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
  deletePageContentItem,
  getPageContentItems,
  pageContentItemCollectionChangeListener,
  updatePageContentItem,
} from 'firestore/pageContentItems';

import { ActionSheet } from 'react-native-ui-lib';
import { DateTime } from 'luxon';
import { EditPageContentItemModal } from 'components/admin/modals/EditPageContentItemModal';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PageContentItem } from 'types/pageContentItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';
import { useHeaderHeight } from '@react-navigation/elements';

type ContentItemFilter = 'active-only' | 'archive-only' | 'all';

export type Props = NativeStackScreenProps<
  MoreNavigatorParamList,
  'AdminPageContent'
>;

const AdminPageContentScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const pageName = route.params.pageName;

  const headerHeight = useHeaderHeight();
  const iosLargeTitleHeight = theme.styles.iosLargeHeader.height as number;
  const contentTop = headerHeight + iosLargeTitleHeight;

  const [cardFilterActionSheetVisible, setCardFilterActionSheetVisible] =
    useState(false);

  const editPageContentItemModalRef = useRef<EditPageContentItemModal>(null);

  const allLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastDocument = useRef<FirebaseFirestoreTypes.DocumentData>();

  const [sortEnabled, setSortEnabled] = useState(false);
  const orderChangeCount = useRef(0);

  const [pageContentItems, setPageContentItems] = useState<PageContentItem[]>(
    [],
  );

  const viewFilter = useRef<ContentItemFilter>('all');
  const [filteredPageContentItems, setFilteredPageContentItems] = useState<
    PageContentItem[]
  >([]);

  useEffect(() => {
    navigation.setOptions({
      title: pageName || 'All Page Content',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = pageContentItemCollectionChangeListener(
      snapshot => {
        if (orderChangeCount.current <= 0) {
          const updated: PageContentItem[] = [];
          snapshot.docs.forEach(d => {
            updated.push({ ...d.data(), id: d.id } as PageContentItem);
          });
          setPageContentItems(sortFilterContentItems(updated));
          lastDocument.current = snapshot.docs[snapshot.docs.length - 1];
          allLoaded.current = false;
        } else {
          orderChangeCount.current--;
        }
      },
      { lastDocument: lastDocument.current },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyViewFilterToContentItems(viewFilter.current || 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageContentItems]);

  const getMoreContentItems = async () => {
    if (!allLoaded.current) {
      setIsLoading(true);
      const s = await getPageContentItems({
        lastDocument: lastDocument.current,
      });
      lastDocument.current = s.lastDocument;
      setPageContentItems(
        sortFilterContentItems(pageContentItems.concat(s.result)),
      );
      allLoaded.current = s.allLoaded;
      setIsLoading(false);
    }
  };

  const sortFilterContentItems = (items: PageContentItem[]) => {
    return lodash
      .filter(items, p => {
        return p.assignment === pageName;
      })
      .sort((a, b) => {
        return a.ordinal - b.ordinal;
      });
  };

  const applyViewFilterToContentItems = (filter: ContentItemFilter) => {
    const items = lodash.filter(pageContentItems, p => {
      return (
        (filter === 'active-only' && p.status === 'active') ||
        (filter === 'archive-only' && p.status === 'archived') ||
        filter === 'all'
      );
    });
    setFilteredPageContentItems(items);
    viewFilter.current = filter;
  };

  const onDragEnd = ({ data }: DragEndParams<PageContentItem>) => {
    // Keep track of how many items are updated after drag.
    // Use this count to prevent state updates when the collection listener
    // reeives events for these changes. Preventing state updates at the listener
    // prevents excessive re-renders which creates a poor UX.
    orderChangeCount.current = 0;
    data.forEach((item, index) => {
      item.ordinal = index;
      if (item.name !== filteredPageContentItems[index].name) {
        updatePageContentItem(item);
        orderChangeCount.current++;
      }
    });
    setFilteredPageContentItems(data);
  };

  const archivePageContent = (item: PageContentItem) => {
    item.status = 'archived';
    updatePageContentItem(item);
  };

  const confirmDeletePageContent = async (id: string) => {
    Alert.alert(
      'Confirm Delete Content',
      'Are you sure you want to delete this content?',
      [
        {
          text: 'Yes, delete',
          onPress: () => deletePageContentItem(id),
          style: 'destructive',
        },
        { text: 'No', style: 'cancel' },
      ],
      { cancelable: false },
    );
  };

  const renderPageContentItem = ({
    item,
    getIndex,
    drag,
  }: RenderItemParams<PageContentItem>) => {
    const index = getIndex();
    const startDate = DateTime.fromISO(item.schedule.startDate).toFormat(
      'MMM d, yyyy',
    );
    const endDate =
      item.schedule.endDate.length > 0
        ? DateTime.fromISO(item.schedule.endDate).toFormat('MMM d, yyyy')
        : undefined;
    return (
      <ShadowDecorator opacity={0.1} radius={10}>
        <ListItem
          title={item.name}
          subtitle={
            item.schedule.enabled
              ? endDate
                ? `${startDate} to ${endDate}`
                : `Starting on ${startDate}`
              : 'Not scheduled'
          }
          position={[
            index === 0 ? 'first' : undefined,
            index === filteredPageContentItems.length - 1 ? 'last' : undefined,
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
            editPageContentItemModalRef.current?.present('Edit Card', item)
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
              onPress: () => confirmDeletePageContent(item.id || ''),
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
              onPress: () => archivePageContent(item),
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
        title={'Add card'}
        position={['first', 'last']}
        leftImage={'card-plus-outline'}
        leftImageType={'material-community'}
        onPress={() => editPageContentItemModalRef.current?.present('New Card')}
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
            text={'CARDS'}
            rightComponent={
              <View style={{ flexDirection: 'row' }}>
                <Button
                  type={'clear'}
                  buttonStyle={s.addAnnouncementButton}
                  containerStyle={{ marginRight: 15 }}
                  icon={
                    <Icon
                      name={'filter-outline'}
                      type={'material-community'}
                      color={theme.colors.brandSecondary}
                      size={26}
                    />
                  }
                  onPress={() =>
                    setCardFilterActionSheetVisible(
                      !cardFilterActionSheetVisible,
                    )
                  }
                />
                <Button
                  type={'clear'}
                  buttonStyle={s.addAnnouncementButton}
                  containerStyle={{ marginRight: 15, marginTop: 1 }}
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
                    editPageContentItemModalRef.current?.present('New Card')
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
            data={filteredPageContentItems}
            renderItem={renderPageContentItem}
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
      <EditPageContentItemModal ref={editPageContentItemModalRef} />
      <ActionSheet
        title={'Filter Cards'}
        cancelButtonIndex={3}
        options={[
          {
            label: 'Active Cards ',
            onPress: () => applyViewFilterToContentItems('active-only'),
          },
          {
            label: 'Archived Cards',
            onPress: () => applyViewFilterToContentItems('archive-only'),
          },
          {
            label: 'All Cards',
            onPress: () => applyViewFilterToContentItems('all'),
          },
          { label: 'Cancel' },
        ]}
        useNativeIOS={true}
        visible={cardFilterActionSheetVisible}
        onDismiss={() => setCardFilterActionSheetVisible(false)}
      />
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

export default AdminPageContentScreen;
