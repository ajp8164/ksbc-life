import * as ImagePicker from 'react-native-image-picker';

import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Avatar, Button, Icon } from '@rneui/base';
import { EditorState, GroupViewMethods, GroupViewProps } from './types';
import {
  Image as ImageUpload,
  deleteImage,
  uploadImage,
} from 'firebase/storage';
import {
  ListItem,
  ListItemAccordian,
  ListItemInput,
  selectImage,
} from '@react-native-ajp-elements/ui';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { calculateGroupName, getGroupUserProfiles } from 'lib/group';
import {
  saveGroup as commitGroup,
  groupsDocumentChangeListener,
  usersDocumentChangeListener,
} from 'firebase/firestore';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import { UserProfileModal } from 'components/modals/UserProfileModal';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { openComposer } from 'react-native-email-link';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { useSelector } from 'react-redux';
import { useSetState } from '@react-native-ajp-elements/core';

type GroupView = GroupViewMethods;

const GroupView = React.forwardRef<GroupView, GroupViewProps>((props, ref) => {
  const { group: groupProp, onEditorStateChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const [group, setGroup] = useState(groupProp);
  const groupImageUrl = useRef(groupProp.photoUrl);
  const [groupName, setGroupName] = useState(groupProp.name);
  const [groupUserProfiles, setGroupUserProfiles] = useState<UserProfile[]>();
  const myUserProfile = useSelector(selectUserProfile);

  const [editorState, setEditorState] = useSetState<EditorState>({
    isSubmitting: false,
  });

  const userProfileModalRef = useRef<UserProfileModal>(null);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
  }));

  useEffect(() => {
    onEditorStateChange && onEditorStateChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    // Wait until the group is updated after a save.
    setEditorState({ isSubmitting: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  useEffect(() => {
    getGroupUserProfiles(group.members).then(userProfiles => {
      setGroupUserProfiles(userProfiles);

      const uid = userProfiles?.[0].id;
      if (userProfiles?.length !== 1 || !uid) return;

      // User document listener for group with single user.
      const subscription = usersDocumentChangeListener(uid, async snapshot => {
        setGroupUserProfiles([snapshot.data() as UserProfile]);
      });
      return subscription;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group document listener.
  useEffect(() => {
    if (!group?.id) return;

    const subscription = groupsDocumentChangeListener(
      group.id,
      async snapshot => {
        setGroup(snapshot.data() as Group);
      },
    );
    return subscription;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveGroup = async () => {
    const g: Group = {
      ...group,
      name: groupName,
      photoUrl: groupImageUrl.current,
    };

    try {
      await commitGroup(g);
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Group Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  const saveGroupName = () => {
    setEditorState({ isSubmitting: true });
    saveGroup();
  };

  const selectGroupImage = () => {
    selectImage({
      onSuccess: imageAssets => {
        saveGroupImage(imageAssets[0]);
      },
    });
  };

  const saveGroupImage = async (imageAsset: ImagePicker.Asset) => {
    setEditorState({ isSubmitting: true });
    await uploadImage({
      image: {
        mimeType: imageAsset.type,
        uri: imageAsset.uri,
      } as ImageUpload,
      storagePath: appConfig.storageImageGroups,
      oldImage: group?.photoUrl,
      onSuccess: url => {
        groupImageUrl.current = url;
        saveGroup();
      },
      onError: () => {
        return;
      },
    });
  };

  const deleteGroupImage = async () => {
    if (group?.photoUrl) {
      setEditorState({ isSubmitting: true });
      await deleteImage({
        filename: group.photoUrl,
        storagePath: appConfig.storageImageGroups,
      })
        .then(() => {
          groupImageUrl.current = '';
          saveGroup();
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

  const renderGroupHeader = () => {
    return (
      <>
        <TouchableWithoutFeedback onPress={selectGroupImage}>
          <View style={s.groupHeaderContainer}>
            <ChatAvatar group={group} size={'giant'} avatarStyle={s.avatar} />
            <Icon
              name={'pencil-circle'}
              type={'material-community'}
              color={theme.colors.darkGray}
              size={28}
              containerStyle={s.groupImageEditIcon}
            />
          </View>
        </TouchableWithoutFeedback>
        {group.photoUrl && (
          <Button
            type={'clear'}
            title={'Delete photo'}
            titleStyle={s.groupImageDeleteTitle}
            buttonStyle={{ padding: 0 }}
            containerStyle={s.groupImageDeleteContainer}
            onPress={deleteGroupImage}
          />
        )}
        <ListItemInput
          placeholder={'Group name'}
          placeholderTextColor={theme.colors.textPlaceholder}
          inputTextStyle={s.groupNameText}
          contentStyle={s.groupNameInput}
          containerStyle={s.groupNameInputContainer}
          value={groupName}
          onChangeText={text => setGroupName(text)}
          onBlur={saveGroupName}
        />
      </>
    );
  };

  const renderUserHeader = () => {
    let profile = myUserProfile;

    if (groupUserProfiles && groupUserProfiles.length > 1) {
      profile = groupUserProfiles?.filter(u => {
        return u.id !== myUserProfile?.id;
      })?.[0];
    }

    return (
      <View style={s.userHeaderContainer}>
        <ChatAvatar
          userProfile={profile}
          size={'giant'}
          avatarStyle={s.avatar}
        />
        <Text style={s.groupNameText}>
          {calculateGroupName({ ...group, extended: { groupUserProfiles } })}
        </Text>
      </View>
    );
  };

  const renderGroupList = () => {
    return (
      <ListItemAccordian
        // I am included in the groupUserProfiles but we don't include me in this list.
        // We don't get here unless groupUserProfiles is at least 2.
        title={`${groupUserProfiles && groupUserProfiles.length - 1} People`}
        titleStyle={s.title}
        leftImage={
          <Avatar
            icon={{
              name: 'account-multiple-outline',
              type: 'material-community',
              size: 30,
              color: theme.colors.white,
            }}
            imageProps={s.groupAvatar}
            containerStyle={s.groupAvatarContainer}
          />
        }
        position={['first', 'last']}
        containerStyle={s.groupContainer}>
        <FlatList
          // I am included in the groupUserProfiles but we don't include me in this list.
          data={groupUserProfiles?.filter(u => {
            return u.id !== myUserProfile?.id;
          })}
          renderItem={renderGroupMember}
          keyExtractor={item => `${item.id}`}
          scrollEnabled={false}
        />
      </ListItemAccordian>
    );
  };

  const renderGroupMember: ListRenderItem<UserProfile> = ({
    item: userProfile,
    index,
  }) => {
    return (
      <ListItem
        title={userProfile.name || userProfile.email}
        titleStyle={s.title}
        leftImage={<ChatAvatar userProfile={userProfile} size={'medium'} />}
        containerStyle={s.groupMemberContainer}
        position={[
          index === 0 ? 'first' : undefined,
          index === (groupUserProfiles && groupUserProfiles.length - 1)
            ? 'last'
            : undefined,
        ]}
        onPress={() => userProfileModalRef.current?.present(userProfile)}
      />
    );
  };

  const renderUserActions = () => {
    // This group is composed of only me when there is one user in then group.
    let profile = myUserProfile;

    if (groupUserProfiles && groupUserProfiles.length > 1) {
      profile = groupUserProfiles?.filter(u => {
        return u.id !== myUserProfile?.id;
      })?.[0];
    }

    return (
      <View style={s.userActionsContainer}>
        <Pressable
          style={[s.userAction, !profile && { opacity: 0.4 }]}
          onPress={() => profile && openEmail(profile.email)}>
          <Avatar
            icon={{
              name: 'email-outline',
              type: 'material-community',
              size: 20,
              color: theme.colors.white,
            }}
            imageProps={s.userActionAvatar}
            containerStyle={s.userActionAvatarContainer}
          />
          <Text style={s.userActionText}>{'Email'}</Text>
        </Pressable>
        <Pressable
          style={[s.userAction, !profile && { opacity: 0.4 }]}
          onPress={() =>
            profile && userProfileModalRef.current?.present(profile)
          }>
          <Avatar
            icon={{
              name: 'card-account-details-outline',
              type: 'material-community',
              size: 20,
              color: theme.colors.white,
            }}
            imageProps={s.userActionAvatar}
            containerStyle={s.userActionAvatarContainer}
          />
          <Text style={s.userActionText}>{'Info'}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <AvoidSoftInputView style={theme.styles.viewAlt}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.container}>
          {group.members.length > 2 ? renderGroupHeader() : renderUserHeader()}
          {groupUserProfiles && groupUserProfiles.length > 2
            ? renderGroupList()
            : renderUserActions()}
        </ScrollView>
      </AvoidSoftInputView>
      <UserProfileModal ref={userProfileModalRef} />
    </>
  );
});

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
  groupAvatar: {
    resizeMode: 'contain',
  },
  groupAvatarContainer: {
    backgroundColor: theme.colors.brandSecondary,
    width: 42,
    height: 42,
    borderRadius: 42,
  },
  groupContainer: {
    backgroundColor: theme.colors.listItemBackgroundAlt,
    marginTop: 30,
  },
  groupHeaderContainer: {
    alignSelf: 'center',
  },
  groupImageEditIcon: {
    position: 'absolute',
    top: 80,
    left: 80,
    alignSelf: 'center',
  },
  groupImageDeleteContainer: {
    marginTop: -10,
    alignSelf: 'center',
  },
  groupImageDeleteTitle: {
    ...theme.styles.textSmall,
    color: theme.colors.assertive,
  },
  groupMemberContainer: {
    backgroundColor: theme.colors.listItemBackgroundAlt,
  },
  groupNameInput: {
    height: 30,
    alignItems: 'center',
  },
  groupNameInputContainer: {
    top: 10,
    padding: 5,
  },
  groupNameText: {
    ...theme.styles.textXL,
    ...theme.styles.textBold,
    textAlign: 'center',
    height: 50,
  },
  title: {
    left: 20,
  },
  userAction: {
    borderRadius: 12,
    backgroundColor: theme.colors.subtleGray,
    width: '49%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  userActionAvatar: {
    resizeMode: 'contain',
  },
  userActionAvatarContainer: {
    backgroundColor: theme.colors.brandSecondary,
    width: 32,
    height: 32,
    borderRadius: 32,
  },
  userActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  userActionText: {
    ...theme.styles.textNormal,
    marginLeft: 10,
  },
  userHeaderContainer: {
    alignSelf: 'center',
  },
}));

export default GroupView;
