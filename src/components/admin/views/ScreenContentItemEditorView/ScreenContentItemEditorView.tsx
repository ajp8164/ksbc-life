import * as ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
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
import { ellipsis, useSetState } from '@react-native-ajp-elements/core';
import Card from 'components/molecules/Card';
import { ScrollView } from 'react-native-gesture-handler';
import { TextModal } from 'components/modals/TextModal';

enum Fields {
  body,
  footer,
  header,
  name,
  photoUrl,
  title,
}

type FormValues = {
  body: string;
  footer: string;
  header: string;
  name: string;
  photoUrl: string;
  title: string;
};

type ScreenContentItemEditorView = ScreenContentItemEditorViewMethods;

const ScreenContentItemEditorView = React.forwardRef<
  ScreenContentItemEditorView,
  ScreenContentItemEditorViewProps
>((props, ref) => {
  const { screenContentItem, onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const bodyTextModalRef = useRef<TextModal>(null);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refBody = useRef<TextInput>(null);
  const refName = useRef<TextInput>(null);
  const refFooter = useRef<TextInput>(null);
  const refHeader = useRef<TextInput>(null);
  const refPhotoUrl = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);

  const screenContentImageAsset = useRef<ImagePicker.Asset>();

  // Same order as on form.
  const fieldRefs = [
    refName.current,
    refTitle.current,
    refFooter.current,
    refBody.current,
    refHeader.current,
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
      ordinal: screenContentItem?.ordinal || -1,
      name: values.name,
      kind: 'card',
      content: {
        body: values.body,
        footer: values.footer,
        header: values.header,
        photoUrl: values.photoUrl,
        title: values.title,
      },
      schedule: {
        startDate: '',
        endDate: '',
      },
      status: 'active',
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

  const saveBodyText = (text: string) => {
    formikRef.current?.setFieldValue('body', text);
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
    if (formikRef.current?.values.photoUrl) {
      await deleteImage({
        filename: formikRef.current?.values.photoUrl,
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
    body: Yup.string(),
    footer: Yup.string(),
    header: Yup.string(),
    name: Yup.string().required('Content name is required'),
    photoUrl: Yup.string(),
    title: Yup.string(),
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
              body: screenContentItem?.content.body || '',
              footer: screenContentItem?.content.footer || '',
              header: screenContentItem?.content.header || '',
              name: screenContentItem?.name || '',
              photoUrl: screenContentItem?.content.photoUrl || '',
              title: screenContentItem?.content.title || '',
            }}
            validateOnChange={true}
            validateOnMount={true}
            validateOnBlur={true}
            validationSchema={validationSchema}
            onSubmit={save}>
            {formik => (
              <View style={{}}>
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
                <View
                  style={[
                    {
                      backgroundColor: theme.colors.viewBackground,
                      paddingVertical: 15,
                    },
                  ]}>
                  <Card
                    title={
                      formik.values.title.length > 0
                        ? formik.values.title
                        : undefined
                    }
                    header={
                      formik.values.header.length > 0
                        ? formik.values.header
                        : undefined
                    }
                    body={
                      formik.values.body.length > 0
                        ? formik.values.body
                        : undefined
                    }
                    footer={
                      formik.values.footer.length > 0
                        ? formik.values.footer
                        : undefined
                    }
                    imageSource={
                      formik.values.photoUrl.length > 0
                        ? { uri: formik.values.photoUrl }
                        : undefined
                    }
                    imageHeight={100}
                    cardStyle={[theme.styles.viewWidth, { paddingVertical: 0 }]}
                    titleStyle={{ textAlign: 'left' }}
                    // buttons={[
                    //   {
                    //     label: 'Share',
                    //     icon: 'share-variant',
                    //     onPress: () => {
                    //       openShareSheet({
                    //         title: 'John 3:16 CSB',
                    //         message:
                    //           'For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
                    //       });
                    //     },
                    //   },
                    //   {
                    //     label: 'Read',
                    //     icon: 'book-open-variant',
                    //     onPress: () => {
                    //       openURL('https://www.bible.com/bible/1713/JHN.3.CSB');
                    //     },
                    //   },
                    // ]}
                  />
                </View>
                <View style={theme.styles.viewAlt}>
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
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.name })
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
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.title })
                    }
                  />
                  <ListItemInput
                    refInner={refHeader}
                    placeholder={'Header'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.header}
                    errorText={formik.errors.header}
                    errorColor={theme.colors.error}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('header')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('header')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.header })
                    }
                  />
                  <ListItem
                    title={
                      formik.values.body.length > 0
                        ? ellipsis(formik.values.body, 35)
                        : 'Body'
                    }
                    titleStyle={
                      formik.values.body.length > 0
                        ? theme.styles.textNormal
                        : theme.styles.textPlaceholder
                    }
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={() => bodyTextModalRef.current?.present()}
                  />
                  <ListItemInput
                    refInner={refFooter}
                    placeholder={'Footer'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.footer}
                    errorText={formik.errors.footer}
                    errorColor={theme.colors.error}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('footer')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('footer')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.footer })
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
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
      <TextModal
        ref={bodyTextModalRef}
        placeholder={'Type your content here'}
        characterLimit={100}
        headerTitle={'Body Text'}
        snapPoints={['45%']}
        value={formikRef.current?.values.body}
        onDismiss={saveBodyText}
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

export default ScreenContentItemEditorView;
