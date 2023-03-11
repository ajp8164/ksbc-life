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
import { Divider, ListItemInput } from '@react-native-ajp-elements/ui';
import {
  EditorState,
  PasteurEditorViewMethods,
  PasteurEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { Input } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { putPasteur } from 'firestore/church';
import { useSetState } from '@react-native-ajp-elements/core';
import { uuidv4 } from 'lib/uuid';

enum Fields {
  firstName,
  lastName,
  title,
  email,
  phone,
  photoUrl,
  bio,
}

type FormValues = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
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
  const refBio = useRef<TextInput & Input>(null);

  // Same order as on form.
  const fieldRefs = [
    refFirstName.current,
    refLastName.current,
    refTitle.current,
    refEmail.current,
    refPhone.current,
    refBio.current,
    refPhotoUrl.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    isValid: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    savePasteur,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const savePasteur = async () => {
    return formikRef.current?.submitForm();
  };

  const save = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    return putPasteur({
      id: pasteur?.id || uuidv4(),
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.title,
      email: values.email,
      phone: values.phone,
      bio: values.bio,
      photoUrl: values.photoUrl,
    })
      .then(() => {
        resetForm({ values });
        setEditorState({ isSubmitting: false });
      })
      .catch((e: Error) => {
        Alert.alert(
          'Pasteur Not Saved',
          'Please try again. If this problem persists please contact support.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
        setEditorState({ isSubmitting: false });
        throw e;
      });
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    title: Yup.string(),
    email: Yup.string().email('Must be a valid email address'),
    phone: Yup.string(),
    photoUrl: Yup.string(),
    bio: Yup.string(),
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
              bio: pasteur?.bio || '',
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
                        isValid: currentState.dirty && currentState.isValid,
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
                <Divider text={'ABOUT'} />
                <Input
                  ref={refBio}
                  style={{ height: 100 }}
                  inputContainerStyle={{ borderBottomWidth: 0 }}
                  containerStyle={s.bioContainer}
                  multiline={true}
                  placeholder={'Biography'}
                  value={formik.values.bio}
                  onChangeText={formik.handleChange('bio')}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('bio')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onFocus={() => setEditorState({ focusedField: Fields.bio })}
                />
                <ListItemInput
                  refInner={refPhotoUrl}
                  placeholder={'Photo'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.photoUrl}
                  errorText={formik.errors.photoUrl}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('photoUrl')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('photoUrl')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.photoUrl })
                  }
                />
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
  bioContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: theme.colors.subtleGray,
  },
}));

export default PasteurEditorView;