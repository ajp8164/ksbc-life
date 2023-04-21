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
import {
  EditorState,
  GroupEditorViewMethods,
  GroupEditorViewProps,
} from './types';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { deleteImage, saveImage } from 'firebase/storage';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { ChatAvatar } from 'components/molecules/ChatAvatar';
import { Group } from 'types/group';
import { UserProfile } from 'types/user';
import { appConfig } from 'config';
import { saveGroup as commitGroup } from 'firebase/firestore';
import { getGroupName } from 'lib/group';
import { makeStyles } from '@rneui/themed';
import { openComposer } from 'react-native-email-link';
import { selectUserProfile } from 'store/selectors/userSelectors';
import { selectUserProfilesCache } from 'store/selectors/cacheSelectors';
import { useSelector } from 'react-redux';
import { useSetState } from '@react-native-ajp-elements/core';

type GroupEditorView = GroupEditorViewMethods;

const GroupEditorView = React.forwardRef<GroupEditorView, GroupEditorViewProps>(
  (props, ref) => {
    const { group, onEditorStateChange } = props;

    const theme = useTheme();
    const s = useStyles(theme);

    const groupImageAsset = useRef<ImagePicker.Asset>();
    const groupImageUrl = useRef(group.photoUrl);
    const [groupName, setGroupName] = useState(getGroupName(group) || '');

    const me = useSelector(selectUserProfile);
    const userProfiles = useSelector(selectUserProfilesCache);
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
      setGroupUserProfiles(getGroupUserProfiles());
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
        await saveImage({
          imageAsset: groupImageAsset.current,
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

    const getGroupUserProfiles = () => {
      const u: UserProfile[] = [];
      group.members.forEach(id => {
        if (id !== me?.id) {
          const p = userProfiles.find(u => id === u.id);
          if (p) {
            u.push(p);
          }
        }
      });
      return u;
    };

    const renderGroup: ListRenderItem<UserProfile> = ({
      item: userProfile,
      index,
    }) => {
      return (
        <ListItem
          title={'Email'}
          titleStyle={theme.styles.listItemSubtitle}
          subtitle={userProfile.email}
          subtitleStyle={theme.styles.listItemTitle}
          containerStyle={{
            backgroundColor: theme.colors.listItemBackgroundAlt,
          }}
          position={[
            index === 0 ? 'first' : undefined,
            index === (groupUserProfiles && groupUserProfiles.length - 1)
              ? 'last'
              : undefined,
          ]}
          rightImage={false}
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
                <ChatAvatar
                  group={group}
                  size={'giant'}
                  avatarStyle={s.avatar}
                />
                <Text style={s.groupNameText}>{getGroupName(group)}</Text>
              </View>
            )}
            <Divider />
            <FlatList
              data={groupUserProfiles}
              renderItem={renderGroup}
              keyExtractor={item => `${item.id}`}
              scrollEnabled={false}
            />
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
  groupNameText: {
    ...theme.styles.textXL,
    ...theme.styles.textBold,
    textAlign: 'center',
  },
}));

export default GroupEditorView;
