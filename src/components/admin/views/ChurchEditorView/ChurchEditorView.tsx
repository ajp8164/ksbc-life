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
  ChurchEditorViewMethods,
  ChurchEditorViewProps,
  EditorState,
} from './types';
import {
  Divider,
  ListItem,
  ListItemInput,
  viewport,
} from '@react-native-ajp-elements/ui';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { deleteImage, saveImage, selectImage } from 'lib/imageSelect';
import { ellipsis, useSetState } from '@react-native-ajp-elements/core';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { Church } from 'types/church';
import FormikEffect from 'components/atoms/FormikEffect';
import { TextModal } from 'components/modals/TextModal';
import { appConfig } from 'config';
import { saveChurch as commitChurch } from 'firestore/church';
import { makeStyles } from '@rneui/themed';

enum Fields {
  name,
  shortName,
  values,
  beliefs,
}

type FormValues = {
  name: string;
  shortName: string;
  values: string;
  beliefs: string;
  photoUrl: string;
};

type ChurchEditorView = ChurchEditorViewMethods;

const ChurchEditorView = React.forwardRef<
  ChurchEditorView,
  ChurchEditorViewProps
>((props, ref) => {
  const { church, onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refName = useRef<TextInput>(null);
  const refShortName = useRef<TextInput>(null);

  const beliefsModalRef = useRef<TextModal>(null);
  const valuesModalRef = useRef<TextModal>(null);
  const churchImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [refName.current];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveChurch,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveBeliefs = (text: string) => {
    formikRef.current?.setFieldValue('beliefs', text);
  };

  const saveValues = (text: string) => {
    formikRef.current?.setFieldValue('values', text);
  };

  const saveChurch = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await saveChurchImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.photoUrl = formikRef.current?.values.photoUrl || '';

    const c: Church = {
      name: values.name,
      shortName: values.shortName,
      values: values.values,
      beliefs: values.beliefs,
      photoUrl: values.photoUrl,
    };

    if (church?.id) {
      c.id = church.id;
    }

    try {
      await commitChurch(c);
      resetForm({ values });
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Church Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
      throw e;
    }
  };

  const selectChurchImage = () => {
    selectImage({
      onSuccess: imageAsset => {
        churchImageAsset.current = imageAsset;
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

  const saveChurchImage = async () => {
    if (churchImageAsset.current) {
      await saveImage({
        imageAsset: churchImageAsset.current,
        storagePath: appConfig.storageImageChurch,
        oldImage: church?.photoUrl,
        onSuccess: url => formikRef.current?.setFieldValue('photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('photoUrl', ''),
      });
    }
  };

  const deleteChurchImage = async () => {
    if (church?.photoUrl) {
      await deleteImage({
        filename: church.photoUrl,
        storagePath: appConfig.storageImageChurch,
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
    name: Yup.string().required('Name is required'),
    shortName: Yup.string(),
    values: Yup.string().max(1200),
    beliefs: Yup.string().max(1200),
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
              name: church?.name || '',
              shortName: church?.shortName || '',
              values: church?.values || '',
              beliefs: church?.beliefs || '',
              photoUrl: church?.photoUrl || '',
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
                  placeholder={'Name'}
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
                <ListItemInput
                  refInner={refShortName}
                  placeholder={'Abbreviation'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.shortName}
                  errorText={formik.errors.shortName}
                  errorColor={theme.colors.error}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('shortName')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('shortName')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.shortName })
                  }
                />
                <Divider text={'OUR VALUES'} />
                <ListItem
                  title={
                    formik.values.values.length
                      ? `${ellipsis(formik.values.values, 200)}`
                      : 'Add church values'
                  }
                  titleStyle={
                    !formik.values.values.length
                      ? { ...theme.styles.textPlaceholder }
                      : {}
                  }
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={valuesModalRef.current?.present}
                />
                <Divider text={'OUR BELIEFS'} />
                <ListItem
                  title={
                    formik.values.beliefs.length
                      ? `${ellipsis(formik.values.beliefs, 200)}`
                      : 'Add church beliefs'
                  }
                  titleStyle={
                    !formik.values.beliefs.length
                      ? { ...theme.styles.textPlaceholder }
                      : {}
                  }
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={beliefsModalRef.current?.present}
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
                        onPress={selectChurchImage}
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
                        onPress={deleteChurchImage}
                      />
                    </Image>
                  </>
                ) : (
                  <ListItem
                    title={'Add a photo'}
                    titleStyle={theme.styles.textPlaceholder}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={selectChurchImage}
                  />
                )}
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
      <TextModal
        ref={beliefsModalRef}
        headerTitle={'Our Beliefs'}
        characterLimit={1200}
        value={formikRef.current?.values.beliefs}
        onDismiss={saveBeliefs}
      />
      <TextModal
        ref={valuesModalRef}
        headerTitle={'Our Values'}
        characterLimit={1200}
        value={formikRef.current?.values.values}
        onDismiss={saveValues}
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

export default ChurchEditorView;
