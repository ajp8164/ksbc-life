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
  PastorEditorViewMethods,
  PastorEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
  Image as ImageUpload,
  deleteImage,
  uploadImage,
} from 'firebase/storage';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { ellipsis, useSetState } from '@react-native-ajp-elements/core';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { Pastor } from 'types/pastor';
import { TextModal } from 'components/modals/TextModal';
import { appConfig } from 'config';
import { savePastor as commitPastor } from 'firebase/firestore';
import { makeStyles } from '@rneui/themed';

enum Fields {
  firstName,
  lastName,
  title,
  email,
  phone,
  biography,
  photoUrl,
}

type FormValues = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  biography: string;
  photoUrl: string;
};

type PastorEditorView = PastorEditorViewMethods;

const PastorEditorView = React.forwardRef<
  PastorEditorView,
  PastorEditorViewProps
>((props, ref) => {
  const { onEditorStateChange, pastor } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refFirstName = useRef<TextInput>(null);
  const refLastName = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);

  const biographyModalRef = useRef<TextModal>(null);
  const pastorImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [
    refFirstName.current,
    refLastName.current,
    refTitle.current,
    refEmail.current,
    refPhone.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    savePastor,
  }));

  useEffect(() => {
    onEditorStateChange && onEditorStateChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveBiography = (text: string) => {
    formikRef.current?.setFieldValue('biography', text);
  };

  const savePastor = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await savePastorImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.photoUrl = formikRef.current?.values.photoUrl || '';

    const p: Pastor = {
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.title,
      email: values.email,
      phone: values.phone,
      biography: values.biography,
      photoUrl: values.photoUrl,
    };

    if (pastor?.id) {
      p.id = pastor.id;
    }

    try {
      await commitPastor(p);
      resetForm({ values });
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Pastor Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  };

  const selectPastorImage = () => {
    selectImage({
      onSuccess: imageAssets => {
        pastorImageAsset.current = imageAssets[0];
        formikRef.current?.setFieldValue('photoUrl', imageAssets[0].uri);
      },
    });
  };

  const savePastorImage = async () => {
    if (pastorImageAsset.current) {
      await uploadImage({
        image: {
          mimeType: pastorImageAsset.current.type,
          uri: pastorImageAsset.current.uri,
        } as ImageUpload,
        storagePath: appConfig.storageImagePastors,
        oldImage: pastor?.photoUrl,
        onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
      });
    }
  };

  const deletePastorImage = async () => {
    if (pastor?.photoUrl) {
      await deleteImage({
        filename: pastor.photoUrl,
        storagePath: appConfig.storageImagePastors,
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
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    title: Yup.string(),
    email: Yup.string().email('Must be a valid email address'),
    phone: Yup.string(),
    biography: Yup.string().max(1200),
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
              firstName: pastor?.firstName || '',
              lastName: pastor?.lastName || '',
              title: pastor?.title || '',
              email: pastor?.email || '',
              phone: pastor?.phone || '',
              biography: pastor?.biography || '',
              photoUrl: pastor?.photoUrl || '',
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
                  refInner={refFirstName}
                  placeholder={'First name'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.firstName}
                  errorText={formik.errors.firstName}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('firstName')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('firstName')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.firstName })
                  }
                />
                <ListItemInput
                  refInner={refLastName}
                  placeholder={'Last name'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.lastName}
                  errorText={formik.errors.lastName}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('lastName')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('lastName')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.lastName })
                  }
                />
                <ListItemInput
                  refInner={refTitle}
                  placeholder={'Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.title}
                  errorText={formik.errors.title}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('title')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('title')}
                  onFocus={() => setEditorState({ focusedField: Fields.title })}
                />
                <Divider text={'CONTACT'} />
                <ListItemInput
                  refInner={refEmail}
                  placeholder={'Email address'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.email}
                  errorText={formik.errors.email}
                  errorColor={theme.colors.error}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('email')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('email')}
                  onFocus={() => setEditorState({ focusedField: Fields.email })}
                />
                <ListItemInput
                  refInner={refPhone}
                  placeholder={'Phone number'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.phone}
                  errorText={formik.errors.phone}
                  errorColor={theme.colors.error}
                  keyboardType={'phone-pad'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('phone')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('phone')}
                  onFocus={() => setEditorState({ focusedField: Fields.phone })}
                />
                <Divider text={'ABOUT'} />
                <ListItem
                  title={
                    formik.values.biography.length
                      ? `${ellipsis(formik.values.biography, 200)}`
                      : 'Add a biography'
                  }
                  titleStyle={
                    !formik.values.biography.length
                      ? { ...theme.styles.textPlaceholder }
                      : {}
                  }
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={biographyModalRef.current?.present}
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
                        onPress={selectPastorImage}
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
                        onPress={deletePastorImage}
                      />
                    </Image>
                  </>
                ) : (
                  <ListItem
                    title={'Add a photo'}
                    titleStyle={theme.styles.textPlaceholder}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={selectPastorImage}
                  />
                )}
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
      <TextModal
        ref={biographyModalRef}
        headerTitle={'Biography'}
        characterLimit={1200}
        value={formikRef.current?.values.biography}
        onDismiss={saveBiography}
      />
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

export default PastorEditorView;
