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
  LocationEditorViewMethods,
  LocationEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { deleteImage, saveImage, selectImage } from 'lib/imageSelect';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { Location } from 'types/location';
import { StreetAddress } from 'types/common';
import { appConfig } from 'config';
import { saveLocation as commitLocation } from 'firestore/locations';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  name,
  street1,
  street2,
  city,
  state,
  postalCode,
  email,
  phone,
  photoUrl,
}

type FormValues = {
  name: string;
  address: StreetAddress;
  email: string;
  phone: string;
  photoUrl: string;
};

type LocationEditorView = LocationEditorViewMethods;

const LocationEditorView = React.forwardRef<
  LocationEditorView,
  LocationEditorViewProps
>((props, ref) => {
  const { location, onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refName = useRef<TextInput>(null);
  const refStreet1 = useRef<TextInput>(null);
  const refStreet2 = useRef<TextInput>(null);
  const refCity = useRef<TextInput>(null);
  const refState = useRef<TextInput>(null);
  const refPostalCode = useRef<TextInput>(null);
  const refEmail = useRef<TextInput>(null);
  const refPhone = useRef<TextInput>(null);
  const refPhotoUrl = useRef<TextInput>(null);

  const locationImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [
    refName.current,
    refStreet1.current,
    refStreet2.current,
    refCity.current,
    refState.current,
    refPostalCode.current,
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
    saveLocation,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveLocation = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await saveLocationImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.photoUrl = formikRef.current?.values.photoUrl || '';

    const l: Location = {
      name: values.name,
      address: values.address,
      email: values.email,
      phone: values.phone,
      photoUrl: values.photoUrl,
    };

    if (location?.id) {
      l.id = location.id;
    }

    try {
      await commitLocation(l);
      resetForm({ values });
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Location Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
      throw e;
    }
  };

  const selectLocationImage = () => {
    selectImage({
      onSuccess: imageAsset => {
        locationImageAsset.current = imageAsset;
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

  const saveLocationImage = async () => {
    if (locationImageAsset.current) {
      await saveImage({
        imageAsset: locationImageAsset.current,
        storagePath: appConfig.storageImageLocations,
        oldImage: location?.photoUrl,
        onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
      });
    }
  };

  const deleteLocationImage = async () => {
    if (location?.photoUrl) {
      await deleteImage({
        filename: location.photoUrl,
        storagePath: appConfig.storageImageLocations,
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
    name: Yup.string().required('Location name is required'),
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
              name: location?.name || '',
              address: location?.address || ({} as StreetAddress),
              email: location?.email || '',
              phone: location?.phone || '',
              photoUrl: location?.photoUrl || '',
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
                  placeholder={'Location name'}
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
                <Divider text={'ADDRESS'} />
                <ListItemInput
                  refInner={refStreet1}
                  placeholder={'Street 1'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.address.street1}
                  errorText={formik.errors.address?.street1}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('address.street1')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('address.street1')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.street1 })
                  }
                />
                <ListItemInput
                  refInner={refStreet2}
                  placeholder={'Street 2'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.address.street2}
                  errorText={formik.errors.address?.street2}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('address.street2')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('address.street2')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.street2 })
                  }
                />
                <ListItemInput
                  refInner={refCity}
                  placeholder={'City'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.address.city}
                  errorText={formik.errors.address?.city}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('address.city')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('address.city')}
                  onFocus={() => setEditorState({ focusedField: Fields.city })}
                />
                <ListItemInput
                  refInner={refState}
                  placeholder={'State'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.address.state}
                  errorText={formik.errors.address?.state}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('address.state')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('address.state')}
                  onFocus={() => setEditorState({ focusedField: Fields.state })}
                />
                <ListItemInput
                  refInner={refPostalCode}
                  placeholder={'Postal code'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.address.postalCode}
                  errorText={formik.errors.address?.postalCode}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('address.postalCode')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('address.postalCode')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.postalCode })
                  }
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
                        onPress={selectLocationImage}
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
                        onPress={deleteLocationImage}
                      />
                    </Image>
                  </>
                ) : (
                  <ListItem
                    title={'Add a photo'}
                    titleStyle={theme.styles.textPlaceholder}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={selectLocationImage}
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

export default LocationEditorView;
