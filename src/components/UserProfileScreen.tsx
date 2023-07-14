import { ActivityIndicator, ScrollView, View } from 'react-native';
import {
  MainNavigatorParamList,
  MoreNavigatorParamList,
} from 'types/navigation';
import React, { useEffect, useState } from 'react';
import UserProfileView, { EditorState } from 'components/views/UserProfileView';

import { CompositeScreenProps } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MoreNavigatorParamList, 'UserProfile'>,
  NativeStackScreenProps<MainNavigatorParamList>
>;

const UserProfileScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();

  const [userProfile, _setUserProfile] = useState(route.params.userProfile);
  const [editorState, setEditorState] = useState({} as EditorState);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => {
        return (
          <>
            {editorState.isSubmitting ? (
              <ActivityIndicator color={theme.colors.brandPrimary} />
            ) : null}
          </>
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior={'automatic'}>
        <UserProfileView
          userProfile={userProfile}
          onEditorStateChange={setEditorState}
        />
      </ScrollView>
    </View>
  );
};

export default UserProfileScreen;
