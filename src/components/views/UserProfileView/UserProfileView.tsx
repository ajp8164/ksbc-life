import * as ImagePicker from 'react-native-image-picker';

import {
  Alert,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import { Divider, ListItem, selectImage } from '@react-native-ajp-elements/ui';
import {
  EditorState,
  UserProfileViewMethods,
  UserProfileViewProps,
} from './types';
import {
  Image as ImageUpload,
  deleteImage,
  uploadImage,
} from 'firebase/storage';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { UserProfile } from 'types/user';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { openComposer } from 'react-native-email-link';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { updateUser } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useSetState } from '@react-native-ajp-elements/core';

type UserProfileView = UserProfileViewMethods;

const UserProfileView = React.forwardRef<UserProfileView, UserProfileViewProps>(
  (props, ref) => {
    const {
      userProfile: userProfileProp,
      onEditorStateChange,
      style = 'screen',
    } = props;

    const theme = useTheme();
    const s = useStyles(theme);

    const [userProfile, setUserProfile] = useState(userProfileProp);
    const myUserProfile = useSelector(selectUserProfile);
    const isMyUserProfile = useRef(userProfileProp.id === myUserProfile?.id);

    const userProfileImageAsset = useRef<ImagePicker.Asset>();
    const userProfileImageUrl = useRef(userProfile.photoUrl);

    const [editorState, setEditorState] = useSetState<EditorState>({
      isSubmitting: false,
    });

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
    }));

    useEffect(() => {
      onEditorStateChange && onEditorStateChange(editorState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState]);

    useEffect(() => {
      // Wait until the user profile is updated after a save.
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);

    const saveUserProfile = async () => {
      const u: UserProfile = {
        ...userProfile,
        photoUrl: userProfileImageUrl.current,
      };

      try {
        await updateUser(u);
        setUserProfile(u);
        setEditorState({ isSubmitting: false });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setEditorState({ isSubmitting: false });
        Alert.alert(
          'Profile Not Saved',
          'Please try again.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    };

    const selectUserProfileImage = () => {
      selectImage({
        onSuccess: imageAssets => {
          userProfileImageAsset.current = imageAssets[0];
          saveUserProfileImage();
        },
      });
    };

    const saveUserProfileImage = async () => {
      if (userProfileImageAsset.current) {
        setEditorState({ isSubmitting: true });
        await uploadImage({
          image: {
            mimeType: userProfileImageAsset.current.type,
            uri: userProfileImageAsset.current.uri,
          } as ImageUpload,
          storagePath: appConfig.storageImageUsers,
          oldImage: userProfile?.photoUrl,
          onSuccess: url => {
            userProfileImageUrl.current = url;
            saveUserProfile();
          },
          onError: () => {
            return;
          },
        });
      }
    };

    const deleteUserProfileImage = async () => {
      if (userProfile?.photoUrl.length) {
        setEditorState({ isSubmitting: true });
        await deleteImage({
          filename: userProfile.photoUrl,
          storagePath: appConfig.storageImageUsers,
        })
          .then(() => {
            userProfileImageUrl.current = userProfile.photoUrlDefault;
            saveUserProfile();
          })
          .catch(() => {
            Alert.alert(
              'Image Not Deleted',
              'This image could not be deleted. Please try again.',
              [{ text: 'OK' }],
              { cancelable: false },
            );
          });
      }
    };

    const openEmail = (emailAddress: string) => {
      openComposer({
        to: emailAddress,
      }).catch(() => {
        //
      });
    };

    const renderUserProfileHeader = () => {
      return (
        <View style={s.userProfileHeaderContainer}>
          <ChatAvatar
            userProfile={userProfile}
            size={'giant'}
            avatarStyle={s.avatar}
          />
          <Text style={s.userProfileNameText}>{userProfile.name}</Text>
        </View>
      );
    };

    const renderEditableUserProfileHeader = () => {
      return (
        <>
          <TouchableWithoutFeedback onPress={selectUserProfileImage}>
            <View style={s.userProfileHeaderContainer}>
              <ChatAvatar
                userProfile={userProfile}
                size={'giant'}
                avatarStyle={s.avatar}
              />
              <Icon
                name={'pencil-circle'}
                type={'material-community'}
                color={theme.colors.darkGray}
                size={28}
                containerStyle={s.userProfileImageEditIcon}
              />
            </View>
          </TouchableWithoutFeedback>
          {userProfile.photoUrl && (
            <Button
              type={'clear'}
              title={'Delete photo'}
              titleStyle={s.userProfileImageDeleteTitle}
              buttonStyle={{ padding: 0 }}
              containerStyle={s.userProfileImageDeleteContainer}
              disabled={userProfile.photoUrl === userProfile.photoUrlDefault}
              onPress={deleteUserProfileImage}
            />
          )}
          <Text style={s.userProfileNameText}>{userProfile.name}</Text>
        </>
      );
    };

    const renderUserProfileDetails = () => {
      return (
        <>
          <Divider text={'EMAIL'} />
          <ListItem
            title={userProfile.email}
            position={['first', 'last']}
            containerStyle={style === 'modal' ? s.modalListContainer : {}}
            onPress={() => openEmail(userProfile.email)}
          />
        </>
      );
    };

    return (
      <>
        <AvoidSoftInputView
          style={style === 'screen' ? theme.styles.view : theme.styles.viewAlt}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.container}>
            {isMyUserProfile.current
              ? renderEditableUserProfileHeader()
              : renderUserProfileHeader()}
            {renderUserProfileDetails()}
          </ScrollView>
        </AvoidSoftInputView>
      </>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  avatar: {
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  container: {
    paddingBottom: 50,
  },
  modalListContainer: {
    backgroundColor: theme.colors.subtleGray,
  },
  userProfileHeaderContainer: {
    alignSelf: 'center',
  },
  userProfileImageEditIcon: {
    position: 'absolute',
    top: 80,
    left: 80,
    alignSelf: 'center',
  },
  userProfileImageDeleteContainer: {
    marginTop: -10,
    alignSelf: 'center',
  },
  userProfileImageDeleteTitle: {
    ...theme.styles.textSmall,
    color: theme.colors.assertive,
  },
  userProfileNameText: {
    ...theme.styles.textXL,
    ...theme.styles.textBold,
    textAlign: 'center',
    height: 50,
  },
}));

export default UserProfileView;
