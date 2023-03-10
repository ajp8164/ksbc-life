import {
  AdminNavigatorParamList,
  TabNavigatorParamList,
} from 'types/navigation';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem } from '@react-native-ajp-elements/ui';
import React, { useEffect, useRef } from 'react';

import { CompositeScreenProps } from '@react-navigation/core';
import { EditSermonModal } from 'components/admin/modals/EditSermonModal';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { makeStyles } from '@rneui/themed';
import { selectSermons } from 'store/selectors/adminSelectors';
import { useSelector } from 'react-redux';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AdminNavigatorParamList, 'AdminSermonsList'>,
  NativeStackScreenProps<TabNavigatorParamList>
>;

const AdminSermonsListScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const editSermonModalRef = useRef<EditSermonModal>(null);
  const sermons = useSelector(selectSermons);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <>
          <Button
            type={'clear'}
            icon={
              <Icon
                name="plus"
                type={'material-community'}
                color={theme.colors.brandSecondary}
                size={28}
              />
            }
            onPress={() => editSermonModalRef.current?.present('Add Sermon')}
          />
        </>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView edges={['left', 'right']} style={theme.styles.view}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <Divider />
        {sermons.map((sermon, index) => {
          return (
            <ListItem
              key={sermon.date}
              title={sermon.date}
              subtitle={sermon.title}
              position={[
                index === 0 ? 'first' : undefined,
                index === sermons.length - 1 ? 'last' : undefined,
              ]}
              leftImage={'cross-outline'}
              leftImageType={'material-community'}
              onPress={() =>
                navigation.navigate('AdminSermon', {
                  sermonId: sermon.date,
                })
              }
            />
          );
        })}
      </ScrollView>
      <EditSermonModal ref={editSermonModalRef} />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  text: {
    ...theme.styles.textNormal,
  },
}));

export default AdminSermonsListScreen;
