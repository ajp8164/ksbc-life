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
  viewport,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  ScreenContentItemEditorViewMethods,
  ScreenContentItemEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { deleteImage, saveImage, selectImage } from 'lib/imageSelect';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { ScreenContentItem } from 'types/screenContentItem';
import { appConfig } from 'config';
import { saveScreenContentItem as commitScreenContentItem } from 'firestore/screenContentItems';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  name,
  photoUrl,
}

type FormValues = {
  name: string;
  photoUrl: string;
};

type ScreenContentItemEditorView = ScreenContentItemEditorViewMethods;

const ScreenContentItemEditorView = React.forwardRef<
  ScreenContentItemEditorView,
  ScreenContentItemEditorViewProps
>((props, ref) => {
  const { screenContentItem, onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refName = useRef<TextInput>(null);
  const refPhotoUrl = useRef<TextInput>(null);

  const screenContentImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [refName.current, refPhotoUrl.current];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveScreenContentItem,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveScreenContentItem = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await saveScreenContentImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.photoUrl = formikRef.current?.values.photoUrl || '';

    const s: ScreenContentItem = {
      ordinal: 0,
      name: values.name,
      kind: 'card',
      content: {
        photoUrl: values.photoUrl,
      },
      schedule: {
        startDate: '',
        endDate: '',
      },
    };

    if (screenContentItem?.id) {
      s.id = screenContentItem.id;
    }

    try {
      await commitScreenContentItem(s);
      resetForm({ values });
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Content Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  const selectScreenContentImage = () => {
    selectImage({
      onSuccess: imageAsset => {
        screenContentImageAsset.current = imageAsset;
        formikRef.current?.setFieldValue('photoUrl', imageAsset.uri);
      },
      onError: () => {
        Alert.alert(
          'Image Not Selected',
          'This image could not be selected. Please try again,',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      },
    });
  };

  const saveScreenContentImage = async () => {
    if (screenContentImageAsset.current) {
      await saveImage({
        imageAsset: screenContentImageAsset.current,
        storagePath: appConfig.storageImageScreenContentItems,
        oldImage: screenContentItem?.content.photoUrl,
        onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
      });
    }
  };

  const deleteScreenContentImage = async () => {
    if (screenContentItem?.content.photoUrl) {
      await deleteImage({
        filename: screenContentItem.content.photoUrl,
        storagePath: appConfig.storageImageScreenContentItems,
      })
        .then(() => {
          formikRef.current?.setFieldValue('photoUrl', '');
        })
        .catch(() => {
          Alert.alert(
            'Image Not Deleted',
            'This image could not be deleted. Please try again,',
            [{ text: 'OK' }],
            { cancelable: false },
          );
        });
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Content name is required'),
    street1: Yup.string(),
    street2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    email: Yup.string().email('Must be a valid email address'),
    phone: Yup.string(),
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
              name: screenContentItem?.name || '',
              photoUrl: screenContentItem?.content.photoUrl || '',
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
                  refInner={refName}
                  placeholder={'Content name'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.name}
                  errorText={formik.errors.name}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('name')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('name')}
                  onFocus={() => setEditorState({ focusedField: Fields.name })}
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
                        onPress={selectScreenContentImage}
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
                        onPress={deleteScreenContentImage}
                      />
                    </Image>
                  </>
                ) : (
                  <ListItem
                    title={'Add a photo'}
                    titleStyle={theme.styles.textPlaceholder}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={selectScreenContentImage}
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
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  imageContainer: {
    width: viewport.width - 30,
    height: ((viewport.width - 30) * 9) / 16,
    borderWidth: 1,
    borderColor: theme.colors.subtleGray,
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

export default ScreenContentItemEditorView;
