import { Divider, ListItem } from '@react-native-ajp-elements/ui';

import { MoreNavigatorParamList } from 'types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { SortableList, SortableListItemProps } from 'react-native-ui-lib';
import { useHeaderHeight } from '@react-navigation/elements';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ScreenContentItem } from 'types/screenContent';
import {
  getScreenContentItems,
  screenContentItemCollectionChangeListener,
} from 'firestore/screenContentItems';

interface Item extends SortableListItemProps {
  screenContentItem: ScreenContentItem;
}

type Props = NativeStackScreenProps<MoreNavigatorParamList, 'AdminContent'>;

const AdminContentScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const headerHeight = useHeaderHeight();
  const iosLargeTitleHeight = Platform.OS === 'ios' ? 52 : 0;
  const contentTop = headerHeight + iosLargeTitleHeight;

  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.DocumentData>();
  const [screenContentItems, setScreenContentItems] = useState<Item[]>([]);

  useEffect(() => {
    const subscription = screenContentItemCollectionChangeListener(
      snapshot => {
        const updated: ScreenContentItem[] = [];
        snapshot.docs.forEach(d => {
          updated.push({ ...d.data(), id: d.id } as ScreenContentItem);
        });
        setScreenContentItems(makeRenderData(updated));
        setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
        setAllLoaded(false);
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
      setScreenContentItems(
        screenContentItems.concat(makeRenderData(s.result)),
      );
      setAllLoaded(s.allLoaded);
      setIsLoading(false);
    }
  };

  const renderScreenContentItem = ({
    item,
    index,
  }: {
    item: Item;
    index: number;
  }) => {
    return (
      <View style={{ backgroundColor: theme.colors.hintGray }}>
        <ListItem
          title={item.screenContentItem.content.title}
          position={[
            index === 0 ? 'first' : undefined,
            index === screenContentItems.length - 1 ? 'last' : undefined,
          ]}
          leftImage={'card-multiple-outline'}
          leftImageType={'material-community'}
          onPress={() => navigation.navigate('AdminContent')}
        />
      </View>
    );
  };

  const makeRenderData = (screenContentItems: ScreenContentItem[]): Item[] => {
    return screenContentItems.map((screenContentItem, index) => {
      return {
        id: `${index}`,
        locked: false,
        screenContentItem,
      };
    });
  };

  const renderListEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <ListItem
        title={'Add content'}
        position={['first', 'last']}
        leftImage={'card-multiple-outline'}
        leftImageType={'material-community'}
        // onPress={() => editUserModalRef.current?.present('New User')}
      />
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <View style={{ marginTop: contentTop, flex: 1 }}>
        <View style={{ justifyContent: 'space-around' }}>
          <Divider
            text={'HOME ANNOUNCEMENTS'}
            rightComponent={
              <Button
                type={'clear'}
                buttonStyle={s.addAnnouncementButton}
                icon={
                  <Icon
                    name="plus"
                    type={'material-community'}
                    color={theme.colors.brandSecondary}
                    size={28}
                  />
                }
                // onPress={() =>
                //   editLocationModalRef.current?.present('New Location')
                // }
              />
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <SortableList
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            data={screenContentItems}
            renderItem={renderScreenContentItem}
            ListEmptyComponent={renderListEmptyComponent}
            ListFooterComponent={<Divider />}
            onOrderChange={() => console.log('hello')}
            onEndReached={getMoreContentItems}
            onEndReachedThreshold={0.2}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  addAnnouncementButton: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  activityIndicator: {
    marginVertical: 15,
  },
}));

export default AdminContentScreen;
