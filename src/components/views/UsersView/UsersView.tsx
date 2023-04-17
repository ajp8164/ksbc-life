import { AppTheme, useTheme } from 'theme';
import { ListRenderItem, View } from 'react-native';
import React, { useImperativeHandle, useState } from 'react';
import { UsersViewMethods, UsersViewProps } from './types';

import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { BottomSheetFlatList as FlatList } from '@gorhom/bottom-sheet';
import { ListItemCheckbox } from '@react-native-ajp-elements/ui';
import NoItems from 'components/atoms/NoItems';
import { UserProfile } from 'types/user';
import lodash from 'lodash';
import { makeStyles } from '@rneui/themed';

type UsersView = UsersViewMethods;

const UsersView = React.forwardRef<UsersView, UsersViewProps>((props, ref) => {
  const {
    onDeselect,
    onSelect,
    selected: initialSelected,
    userProfiles,
  } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [selected, setSelected] = useState<UserProfile[]>(initialSelected);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
  }));

  const renderUser: ListRenderItem<UserProfile> = ({ item: userProfile }) => {
    return (
      <ListItemCheckbox
        title={userProfile.name || userProfile.email}
        titleStyle={{ left: 20 }}
        leftImage={<ChatAvatar userProfile={userProfile} size={'medium'} />}
        checkedIcon={'check'}
        checkIconType={'material-community'}
        uncheckedIcon={'checkbox-blank-outline'}
        uncheckedColor={theme.colors.transparent}
        checkedColor={theme.colors.brandSecondary}
        checked={userProfile.id ? selected.includes(userProfile) : false}
        onPress={() => {
          if (userProfile.id) {
            // Id should always be set.
            if (selected.includes(userProfile)) {
              const updatedSelections = ([] as UserProfile[]).concat(selected);
              lodash.remove(updatedSelections, u => u.id === userProfile.id);
              setSelected(updatedSelections);
              onDeselect && onDeselect(userProfile);
            } else {
              const updatedSelections = selected.concat(userProfile);
              setSelected(updatedSelections);
              onSelect(userProfile);
            }
          }
        }}
      />
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={s.emptyListContainer}>
        <NoItems title={'No users'} />
      </View>
    );
  };

  return (
    <FlatList
      data={userProfiles}
      renderItem={renderUser}
      ListEmptyComponent={renderListEmptyComponent}
      keyExtractor={item => `${item.id}`}
      contentContainerStyle={{
        paddingVertical: 15,
        ...theme.styles.viewHorizontalInset,
      }}
      contentInsetAdjustmentBehavior={'automatic'}
    />
  );
});

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  emptyListContainer: {},
}));

export default UsersView;
