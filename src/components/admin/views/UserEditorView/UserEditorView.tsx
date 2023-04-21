import { Alert, ScrollView, Text } from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Divider, ListItem, viewport } from '@react-native-ajp-elements/ui';
import {
  EditorState,
  UserEditorViewMethods,
  UserEditorViewProps,
} from './types';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { UserProfile, UserRole, UserStatus } from 'types/user';

import { Image } from '@rneui/base';
import { UserRolePickerModal } from 'components/admin/modals/UserRolePickerModal';
import { UserStatusPickerModal } from 'components/admin/modals/UserStatusPickerModal';
import { makeStyles } from '@rneui/themed';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { updateUser } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useSetState } from '@react-native-ajp-elements/core';

type UserEditorView = UserEditorViewMethods;

const UserEditorView = React.forwardRef<UserEditorView, UserEditorViewProps>(
  (props, ref) => {
    const { onChange, user } = props;

    const theme = useTheme();
    const s = useStyles(theme);

    const userRolePickerModalRef = useRef<UserRolePickerModal>(null);
    const userStatusPickerModalRef = useRef<UserStatusPickerModal>(null);

    const userProfile = useSelector(selectUserProfile);
    const [userRole, setUserRole] = useState<UserRole>(
      user?.role || UserRole.User,
    );
    const [userStatus, setUserStatus] = useState<UserStatus>(
      user?.status || UserStatus.Active,
    );

    const [editorState, setEditorState] = useSetState<EditorState>({
      isSubmitting: false,
      changed: false,
    });

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      saveUser,
    }));

    useEffect(() => {
      onChange && onChange(editorState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState]);

    const saveUser = async () => {
      setEditorState({ isSubmitting: true });

      const updatedUserProfile: UserProfile = {
        ...(user as UserProfile),
        role: userRole,
        status: userStatus,
      };

      try {
        await updateUser(updatedUserProfile);
        setEditorState({ isSubmitting: false });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setEditorState({ isSubmitting: false });
        Alert.alert('User Not Saved', 'Please try again.', [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    };

    const onUserRoleChange = (userRole: UserRole): void => {
      setUserRole(userRole);
      setEditorState({ changed: user?.role !== userRole });
    };

    const onUserStatusChange = (userStatus: UserStatus): void => {
      setUserStatus(userStatus);
      setEditorState({ changed: user?.status !== userStatus });
    };

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={theme.styles.viewAlt}>
          <Text style={theme.styles.textNormal}>{user?.name}</Text>
          <Text style={theme.styles.textNormal}>{user?.email}</Text>
          <Divider />
          <Image
            source={{ uri: user?.photoUrl }}
            containerStyle={s.imageContainer}
            style={{ resizeMode: 'cover' }}
          />
          <Divider />
          <ListItem
            title={'Role'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            leftImage={'shield-account-outline'}
            leftImageType={'material-community'}
            value={userRole}
            position={['first']}
            onPress={() => userRolePickerModalRef.current?.present()}
          />
          <ListItem
            title={'Status'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            leftImage={'pulse'}
            leftImageType={'material-community'}
            value={userStatus}
            position={['last']}
            onPress={() => userStatusPickerModalRef.current?.present()}
          />
        </ScrollView>
        <UserRolePickerModal
          ref={userRolePickerModalRef}
          value={user?.role as UserRole}
          disabled={user?.id === userProfile?.id}
          onDismiss={onUserRoleChange}
        />
        <UserStatusPickerModal
          ref={userStatusPickerModalRef}
          value={user?.status as UserStatus}
          disabled={user?.id === userProfile?.id}
          onDismiss={onUserStatusChange}
        />
      </>
    );
  },
);

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  imageContainer: {
    width: viewport.width - 30,
    height: ((viewport.width - 30) * 9) / 16,
    borderRadius: 10,
  },
}));

export default UserEditorView;
