import * as ImagePicker from 'react-native-image-picker';

import {
  Alert,
  FlatList,
  ListRenderItem,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import {
  Divider,
  ListItem,
  ListItemInput,
  selectImage,
} from '@react-native-ajp-elements/ui';
import { EditorState, GroupViewMethods, GroupViewProps } from './types';
import {
  Image as ImageUpload,
  deleteImage,
  uploadImage,
} from 'firebase/storage';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getGroupName, getGroupUserProfiles } from 'lib/group';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import { appConfig } from 'config';
import { saveGroup as commitGroup } from 'firebase/firestore';
import { makeStyles } from '@rneui/themed';
import { openComposer } from 'react-native-email-link';
import { useSetState } from '@react-native-ajp-elements/core';

type GroupView = GroupViewMethods;

const GroupView = React.forwardRef<GroupView, GroupViewProps>((props, ref) => {
  const { group, onEditorStateChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const groupImageAsset = useRef<ImagePicker.Asset>();
  const groupImageUrl = useRef(group.photoUrl);
  const [groupName, setGroupName] = useState(group.name);
  const [groupUserProfiles, setGroupUserProfiles] = useState<UserProfile[]>();

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
    // Wait until the group is updated after a save.
    setEditorState({ isSubmitting: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  useEffect(() => {
    getGroupUserProfiles(group.members).then(userProfiles => {
      setGroupUserProfiles(userProfiles);
    });
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
        groupImageAsset.current = imageAssets[0];
        saveGroupImage();
      },
    });
  };

  const saveGroupImage = async () => {
    if (groupImageAsset.current) {
      setEditorState({ isSubmitting: true });
      await uploadImage({
        image: {
          mimeType: groupImageAsset.current.type,
          uri: groupImageAsset.current.uri,
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
    }
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

  const renderGroupMember: ListRenderItem<UserProfile> = ({
    item: userProfile,
    index,
  }) => {
    return (
      <ListItem
        title={userProfile.name || userProfile.email}
        containerStyle={{
          backgroundColor: theme.colors.listItemBackgroundAlt,
        }}
        position={[
          index === 0 ? 'first' : undefined,
          index === (groupUserProfiles && groupUserProfiles.length - 1)
            ? 'last'
            : undefined,
        ]}
        onPress={() => openEmail(userProfile.email)}
      />
    );
  };

  return (
    <>
      <AvoidSoftInputView style={theme.styles.viewAlt}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}>
          {group.members.length > 2 ? (
            <>
              <TouchableWithoutFeedback onPress={selectGroupImage}>
                <View style={{ alignSelf: 'center' }}>
                  <ChatAvatar
                    group={group}
                    size={'giant'}
                    avatarStyle={s.avatar}
                  />
                  <Icon
                    name={'pencil-circle'}
                    type={'material-community'}
                    color={theme.colors.darkGray}
                    size={28}
                    containerStyle={{
                      position: 'absolute',
                      top: 80,
                      left: 80,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
              {group.photoUrl && (
                <Button
                  type={'clear'}
                  title={'Delete photo'}
                  titleStyle={[
                    theme.styles.textSmall,
                    { color: theme.colors.textLink },
                  ]}
                  buttonStyle={{ padding: 0 }}
                  containerStyle={{ marginTop: -10, alignSelf: 'center' }}
                  onPress={deleteGroupImage}
                />
              )}
              <ListItemInput
                placeholder={'Group name'}
                placeholderTextColor={theme.colors.textPlaceholder}
                inputTextStyle={s.groupNameText}
                contentStyle={{
                  height: 30,
                  alignItems: 'center',
                }}
                containerStyle={{ top: 10, padding: 5 }}
                value={groupName}
                onChangeText={text => setGroupName(text)}
                onBlur={saveGroupName}
              />
            </>
          ) : (
            <View style={{ alignSelf: 'center' }}>
              <ChatAvatar group={group} size={'giant'} avatarStyle={s.avatar} />
              <Text style={s.groupNameText}>
                {groupUserProfiles
                  ? getGroupName(group, groupUserProfiles)
                  : ''}
              </Text>
            </View>
          )}
          <Divider text={'GROUP MEMBERS'} style={{ marginTop: 30 }} />
          <FlatList
            data={groupUserProfiles}
            renderItem={renderGroupMember}
            keyExtractor={item => `${item.id}`}
            scrollEnabled={false}
          />
        </ScrollView>
      </AvoidSoftInputView>
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
  groupNameText: {
    ...theme.styles.textXL,
    ...theme.styles.textBold,
    textAlign: 'center',
    height: 50,
  },
}));

export default GroupView;
