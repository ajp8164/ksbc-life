import * as ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon, Image } from '@rneui/base';
import {
  Divider,
  ListItem,
  ListItemInput,
  selectImage,
  viewport,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  GroupEditorViewMethods,
  GroupEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { deleteImage, saveImage } from 'firebase/storage/image';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { Group } from 'types/group';
import { appConfig } from 'config';
import { saveGroup as commitGroup } from 'firebase/firestore/groups';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  groupName,
  photoUrl,
}

type FormValues = {
  groupName: string;
  photoUrl: string;
};

type GroupEditorView = GroupEditorViewMethods;

const GroupEditorView = React.forwardRef<GroupEditorView, GroupEditorViewProps>(
  (props, ref) => {
    const { onEditorStateChange, group } = props;

    const theme = useTheme();
    const s = useStyles(theme);

    const formikRef = useRef<FormikProps<FormValues>>(null);
    const refGroupName = useRef<TextInput>(null);

    const groupImageAsset = useRef<ImagePicker.Asset>();

    // Same order as on form.
    const fieldRefs = [refGroupName.current];

    const [editorState, setEditorState] = useSetState<EditorState>({
      fieldCount: fieldRefs.length,
      focusedField: undefined,
      isSubmitting: false,
      changed: false,
    });

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      saveGroup,
    }));

    useEffect(() => {
      onEditorStateChange && onEditorStateChange(editorState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState]);

    const saveGroup = async () => {
      return formikRef.current?.submitForm();
    };

    const save = async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>,
    ) => {
      Keyboard.dismiss();
      setEditorState({ isSubmitting: true });
      await saveGroupImage();
      // Saving the image updates the form but form values are already passed in.
      // Overwrite the image value after saving the image to storage.
      values.photoUrl = formikRef.current?.values.photoUrl || '';

      const g: Group = {
        ...group,
        name: values.groupName,
        photoUrl: values.photoUrl,
      };

      try {
        await commitGroup(g);
        resetForm({ values });
        setEditorState({ isSubmitting: false });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setEditorState({ isSubmitting: false });
        Alert.alert('Group Not Saved', 'Please try again.', [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    };

    const selectGroupImage = () => {
      selectImage({
        onSuccess: imageAssets => {
          groupImageAsset.current = imageAssets[0];
          formikRef.current?.setFieldValue('photoUrl', imageAssets[0].uri);
        },
      });
    };

    const saveGroupImage = async () => {
      if (groupImageAsset.current) {
        await saveImage({
          imageAsset: groupImageAsset.current,
          storagePath: appConfig.storageImageGroups,
          oldImage: group?.photoUrl,
          onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
          onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
        });
      }
    };

    const deleteGroupImage = async () => {
      if (group?.photoUrl) {
        await deleteImage({
          filename: group.photoUrl,
          storagePath: appConfig.storageImageGroups,
        })
          .then(() => {
            formikRef.current?.setFieldValue('photoUrl', '');
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

    const validationSchema = Yup.object().shape({
      groupName: Yup.string(),
      photoUrl: Yup.string(),
    });

    return (
      <>
        <AvoidSoftInputView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                groupName: group?.name || '',
                photoUrl: group?.photoUrl || '',
              }}
              validateOnChange={true}
              validateOnMount={true}
              validateOnBlur={true}
              validationSchema={validationSchema}
              onSubmit={save}>
              {formik => (
                <View style={theme.styles.viewAlt}>
                  <FormikEffect
                    formik={formik}
                    onChange={(currentState, previousState) => {
                      if (
                        currentState?.dirty !== previousState?.dirty ||
                        currentState?.isValid !== previousState?.isValid
                      ) {
                        setEditorState({
                          changed: currentState.dirty && currentState.isValid,
                        });
                      }
                    }}
                  />
                  <ListItemInput
                    refInner={refGroupName}
                    placeholder={'Group name'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.groupName}
                    errorText={formik.errors.groupName}
                    errorColor={theme.colors.error}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('groupName')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('groupName')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.groupName })
                    }
                  />
                  {formik.values.photoUrl.length ? (
                    <>
                      <Divider />
                      <Image
                        source={{ uri: formik.values.photoUrl }}
                        containerStyle={s.imageContainer}>
                        <Button
                          buttonStyle={s.imageButton}
                          icon={
                            <Icon
                              name="image-edit-outline"
                              type={'material-community'}
                              color={theme.colors.darkGray}
                              size={28}
                            />
                          }
                          onPress={selectGroupImage}
                        />
                        <Button
                          buttonStyle={s.imageButton}
                          icon={
                            <Icon
                              name="close-circle-outline"
                              type={'material-community'}
                              color={theme.colors.assertive}
                              size={28}
                            />
                          }
                          onPress={deleteGroupImage}
                        />
                      </Image>
                    </>
                  ) : (
                    <ListItem
                      title={'Add a photo'}
                      titleStyle={theme.styles.textPlaceholder}
                      containerStyle={{ borderBottomWidth: 0 }}
                      onPress={selectGroupImage}
                    />
                  )}
                </View>
              )}
            </Formik>
          </ScrollView>
        </AvoidSoftInputView>
        {/* This isn't working inside bottomsheet.
      {Platform.OS === 'ios' && (
        <KeyboardAccessory
          nextDisabled={editorState.focusedField === editorState.fieldCount - 1}
          previousDisabled={editorState.focusedField === 0}
          onNext={next}
          onPrevious={previous}
        />
      )} */}
      </>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  imageContainer: {
    width: viewport.width - 30,
    height: ((viewport.width - 30) * 9) / 16,
    borderWidth: 1,
    borderColor: theme.colors.subtleGray,
    borderRadius: 10,
  },
  imageButton: {
    backgroundColor: theme.colors.whiteTransparentMid,
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
  },
}));

export default GroupEditorView;
