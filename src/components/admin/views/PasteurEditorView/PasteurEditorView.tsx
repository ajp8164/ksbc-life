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
import {
  Divider,
  ListItem,
  ListItemInput,
  viewport,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  PasteurEditorViewMethods,
  PasteurEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { ellipsis, log, useSetState } from '@react-native-ajp-elements/core';
import { saveImage, selectImage } from 'lib/imageSelect';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { Image } from '@rneui/base';
import { TextModal } from 'components/modals/TextModal';
import { appConfig } from 'config';
import { makeStyles } from '@rneui/themed';
import { putPasteur } from 'firestore/church';
import { uuidv4 } from 'lib/uuid';

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

type PasteurEditorView = PasteurEditorViewMethods;

const PasteurEditorView = React.forwardRef<
  PasteurEditorView,
  PasteurEditorViewProps
>((props, ref) => {
  const { onChange, pasteur } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refFirstName = useRef<TextInput>(null);
  const refLastName = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refPhotoUrl = useRef<TextInput>(null);

  const biographyModalRef = useRef<TextModal>(null);
  const pasteurImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [
    refFirstName.current,
    refLastName.current,
    refTitle.current,
    refEmail.current,
    refPhone.current,
    refPhotoUrl.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    savePasteur,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveBiography = (text: string) => {
    formikRef.current?.setFieldValue('biography', text);
  };

  const savePasteur = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await savePasteurImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.photoUrl = formikRef.current?.values.photoUrl || '';
    return (
      putPasteur({
        id: pasteur?.id || uuidv4(),
        firstName: values.firstName,
        lastName: values.lastName,
        title: values.title,
        email: values.email,
        phone: values.phone,
        biography: values.biography,
        photoUrl: values.photoUrl,
      })
        .then(() => {
          resetForm({ values });
          setEditorState({ isSubmitting: false });
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          log.error(`Failed to save pasteur: ${e.message}`);
          Alert.alert(
            'Pasteur Not Saved',
            'Please try again. If this problem persists please contact support.',
            [{ text: 'OK' }],
            { cancelable: false },
          );
          setEditorState({ isSubmitting: false });
        })
    );
  };

  const selectPasteurImage = () => {
    selectImage({
      onSuccess: imageAsset => {
        pasteurImageAsset.current = imageAsset;
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

  const savePasteurImage = async () => {
    if (pasteurImageAsset.current) {
      await saveImage({
        imageAsset: pasteurImageAsset.current,
        storagePath: appConfig.storageImagePasteurs,
        oldImage: pasteur?.photoUrl,
        onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
      });
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    title: Yup.string(),
    email: Yup.string().email('Must be a valid email address'),
    phone: Yup.string(),
    biography: Yup.string().max(2000),
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
              firstName: pasteur?.firstName || '',
              lastName: pasteur?.lastName || '',
              title: pasteur?.title || '',
              email: pasteur?.email || '',
              phone: pasteur?.phone || '',
              biography: pasteur?.biography || '',
              photoUrl: pasteur?.photoUrl || '',
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
                  autoCapitalize={'none'}
                  autoCorrect={false}
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
                  autoCapitalize={'none'}
                  autoCorrect={false}
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
                  autoCapitalize={'none'}
                  autoCorrect={false}
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
                <Divider text={'BIOGRAPHY'} />
                <ListItem
                  title={
                    formik.values.biography.length
                      ? `${ellipsis(formik.values.biography, 200)}`
                      : 'Enter biography'
                  }
                  titleStyle={
                    !formik.values.biography.length
                      ? { ...theme.styles.textPlaceholder }
                      : {}
                  }
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={biographyModalRef.current?.present}
                />
                {formik.values.photoUrl ? (
                  <Image
                    source={{ uri: formik.values.photoUrl }}
                    containerStyle={{
                      width: viewport.width - 30,
                      height: ((viewport.width - 30) * 9) / 16,
                      borderWidth: 1,
                      borderColor: theme.colors.subtleGray,
                    }}
                    onPress={selectPasteurImage}
                  />
                ) : (
                  <ListItem
                    title={'Choose pasteur photo'}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={selectPasteurImage}
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
        placeholder={'Enter biography'}
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
  bioContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: theme.colors.subtleGray,
  },
}));

export default PasteurEditorView;
