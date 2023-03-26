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
  ListItemSwitch,
  viewport,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  ScreenContentItemEditorViewMethods,
  ScreenContentItemEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import { deleteImage, saveImage, selectImage } from 'lib/imageSelect';
import { ellipsis, useSetState } from '@react-native-ajp-elements/core';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from 'components/molecules/Card';
import DateRangePicker from 'components/atoms/DateRangePicker';
import { DateTime } from 'luxon';
import FormikEffect from 'components/atoms/FormikEffect';
import { ScreenContentItem } from 'types/screenContentItem';
import { TabView } from 'components/atoms/TabView';
import { TextModal } from 'components/modals/TextModal';
import { appConfig } from 'config';
import { saveScreenContentItem as commitScreenContentItem } from 'firestore/screenContentItems';
import { makeStyles } from '@rneui/themed';

const initialScreenContentItem: ScreenContentItem = {
  name: '',
  kind: 'card',
  ordinal: -1,
  content: {
    body: '',
    footer: '',
    header: '',
    photoUrl: '',
    title: '',
  },
  schedule: {
    enabled: false,
    startDate: '',
    endDate: '',
  },
  status: 'active',
};

enum Fields {
  body,
  footer,
  header,
  name,
  photoUrl,
  title,
}

type FormValues = ScreenContentItem;

type ScreenContentItemEditorView = ScreenContentItemEditorViewMethods;

const ScreenContentItemEditorView = React.forwardRef<
  ScreenContentItemEditorView,
  ScreenContentItemEditorViewProps
>((props, ref) => {
  const { contentContainerHeight, screenContentItem, onChange } = props;

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
    values.content.photoUrl = formikRef.current?.values.content.photoUrl || '';

    const s: ScreenContentItem = {
      ordinal: screenContentItem?.ordinal || initialScreenContentItem.ordinal,
      name: values.name,
      kind: initialScreenContentItem.kind,
      status: initialScreenContentItem.status,
      content: values.content,
      schedule: values.schedule,
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
    formikRef.current?.setFieldValue('content.body', text);
  };

  const selectScreenContentImage = () => {
    selectImage({
      onSuccess: imageAsset => {
        screenContentImageAsset.current = imageAsset;
        formikRef.current?.setFieldValue('content.photoUrl', imageAsset.uri);
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
        onSuccess: url =>
          formikRef.current?.setFieldValue('content.photoUrl', url),
        onError: () => formikRef.current?.setFieldValue('content.photoUrl', ''),
      });
    }
  };

  const deleteScreenContentImage = async () => {
    if (formikRef.current?.values.content.photoUrl) {
      await deleteImage({
        filename: formikRef.current?.values.content.photoUrl,
        storagePath: appConfig.storageImageScreenContentItems,
      })
        .then(() => {
          formikRef.current?.setFieldValue('content.photoUrl', '');
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

  const toggleScheduleEnabled = (value: boolean) => {
    formikRef.current?.setFieldValue('schedule.enabled', value);
  };

  const onDateRangeSelect = (startDate: string, endDate: string) => {
    formikRef.current?.setFieldValue(
      'schedule.startDate',
      DateTime.fromFormat(startDate, 'yyyy-MM-dd').toISO(),
    );
    formikRef.current?.setFieldValue(
      'schedule.endDate',
      DateTime.fromFormat(endDate, 'yyyy-MM-dd').toISO(),
    );
  };

  const validationSchema = Yup.object().shape({
    body: Yup.string(),
    footer: Yup.string(),
    header: Yup.string(),
    name: Yup.string().required('Content name is required'),
    photoUrl: Yup.string(),
    title: Yup.string(),
  });

  const renderCardPreview = (formik: FormikProps<FormValues>) => {
    const content = formik.values.content;
    return (
      <BottomSheetScrollView style={s.cardPreview}>
        <Card
          title={content.title?.length > 0 ? content.title : undefined}
          header={content.header?.length > 0 ? content.header : undefined}
          body={content.body?.length > 0 ? content.body : undefined}
          footer={content.footer?.length > 0 ? content.footer : undefined}
          imageSource={
            content.photoUrl?.length > 0 ? { uri: content.photoUrl } : undefined
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
      </BottomSheetScrollView>
    );
  };

  const renderContentEditor = (formik: FormikProps<FormValues>) => {
    return (
      <>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={[theme.styles.viewAlt, { flex: 1 }]}>
            <ListItemInput
              refInner={refName}
              title={'Content name'}
              titleStyle={{ color: theme.colors.brandSecondary }}
              titleType={'material'}
              placeholder={'Content name'}
              placeholderTextColor={theme.colors.textPlaceholder}
              value={formik.values.name}
              errorText={formik.errors.name}
              errorColor={theme.colors.error}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                formik.handleBlur('name')(e);
                setEditorState({ focusedField: undefined });
              }}
              onChangeText={formik.handleChange('name')}
              onFocus={() => setEditorState({ focusedField: Fields.name })}
            />
            <ListItemInput
              refInner={refTitle}
              title={'Title'}
              titleStyle={{ color: theme.colors.brandSecondary }}
              titleType={'material'}
              placeholder={'Title'}
              placeholderTextColor={theme.colors.textPlaceholder}
              value={formik.values.content.title}
              errorText={formik.errors.content?.title}
              errorColor={theme.colors.error}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                formik.handleBlur('content.title')(e);
                setEditorState({ focusedField: undefined });
              }}
              onChangeText={formik.handleChange('content.title')}
              onFocus={() => setEditorState({ focusedField: Fields.title })}
            />
            <ListItemInput
              refInner={refHeader}
              title={'Header'}
              titleStyle={{ color: theme.colors.brandSecondary }}
              titleType={'material'}
              placeholder={'Header'}
              placeholderTextColor={theme.colors.textPlaceholder}
              value={formik.values.content.header}
              errorText={formik.errors.content?.header}
              errorColor={theme.colors.error}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                formik.handleBlur('content.header')(e);
                setEditorState({ focusedField: undefined });
              }}
              onChangeText={formik.handleChange('content.header')}
              onFocus={() => setEditorState({ focusedField: Fields.header })}
            />
            <ListItem
              title={
                formik.values.content.body.length > 0
                  ? ellipsis(formik.values.content.body, 35)
                  : 'Body'
              }
              titleStyle={
                formik.values.content.body.length > 0
                  ? theme.styles.textNormal
                  : theme.styles.textPlaceholder
              }
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => bodyTextModalRef.current?.present()}
            />
            <ListItemInput
              refInner={refFooter}
              title={'Footer'}
              titleStyle={{ color: theme.colors.brandSecondary }}
              titleType={'material'}
              placeholder={'Footer'}
              placeholderTextColor={theme.colors.textPlaceholder}
              value={formik.values.content.footer}
              errorText={formik.errors.content?.footer}
              errorColor={theme.colors.error}
              onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                formik.handleBlur('content.footer')(e);
                setEditorState({ focusedField: undefined });
              }}
              onChangeText={formik.handleChange('content.footer')}
              onFocus={() => setEditorState({ focusedField: Fields.footer })}
            />
            {formik.values.content.photoUrl?.length ? (
              <>
                <Divider />
                <Image
                  source={{ uri: formik.values.content.photoUrl }}
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
        </BottomSheetScrollView>
        <TextModal
          ref={bodyTextModalRef}
          placeholder={'Type your content here'}
          characterLimit={100}
          headerTitle={'Body Text'}
          snapPoints={['45%']}
          value={formikRef.current?.values.content.body}
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
  };

  const renderScheduleEditor = (formik: FormikProps<FormValues>) => {
    return (
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1 }}>
        <View style={[theme.styles.viewAlt, { flex: 1 }]}>
          <Divider />
          <ListItemSwitch
            title={'Schedule enabled'}
            value={formik.values.schedule.enabled}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            position={['first']}
            onValueChange={toggleScheduleEnabled}
          />
          <ListItem
            title={'Start date'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            value={
              formik.values.schedule.startDate
                ? DateTime.fromISO(formik.values.schedule.startDate).toFormat(
                    'MMM d, yyyy',
                  )
                : 'None'
            }
            rightImage={false}
          />
          <ListItem
            title={'End date'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            value={
              formik.values.schedule.endDate
                ? DateTime.fromISO(formik.values.schedule.endDate).toFormat(
                    'MMM d, yyyy',
                  )
                : 'None'
            }
            rightImage={false}
            position={['last']}
          />
          <Divider />
          <DateRangePicker
            style={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
              borderRadius: 10,
              paddingBottom: 10,
            }}
            theme={{
              markColor: theme.colors.brandSecondary,
              markTextColor: theme.colors.white,
              calendarBackground: theme.colors.listItemBackgroundAlt,
              backgroundColor: 'red',
            }}
            initialRange={
              formik.values.schedule.startDate && formik.values.schedule.endDate
                ? {
                    fromDate: DateTime.fromISO(
                      formik.values.schedule.startDate,
                    ).toJSDate(),
                    toDate: DateTime.fromISO(
                      formik.values.schedule.endDate,
                    ).toJSDate(),
                  }
                : undefined
            }
            onSuccess={onDateRangeSelect}
          />
        </View>
      </BottomSheetScrollView>
    );
  };

  return (
    <AvoidSoftInputView
      style={[
        theme.styles.viewAlt,
        {
          paddingHorizontal: 0,
          height:
            (contentContainerHeight || 0) +
            (theme.styles.topTabBar.height as number),
        },
      ]}>
      <Formik
        innerRef={formikRef}
        initialValues={screenContentItem || initialScreenContentItem}
        validateOnChange={true}
        validateOnMount={true}
        validateOnBlur={true}
        validationSchema={validationSchema}
        onSubmit={save}>
        {formik => (
          <>
            <FormikEffect
              formik={formik}
              onChange={(currentState, previousState) => {
                if (
                  currentState.dirty !== previousState?.dirty ||
                  currentState.isValid !== previousState?.isValid
                ) {
                  setEditorState({
                    changed: currentState.dirty && currentState.isValid,
                  });
                }
              }}
            />
            <View style={{ height: '100%' }}>
              <ScrollableTabView
                initialPage={0}
                renderTabBar={() => (
                  <DefaultTabBar
                    // @ts-ignore property is incorrectly typed
                    tabBarUnderlineStyle={{
                      backgroundColor: theme.colors.brandSecondary,
                    }}
                    tabStyle={{ paddingBottom: 0 }}
                    textStyle={theme.styles.textNormal}
                    inactiveTextColor={theme.colors.textDim}
                    style={{ borderBottomColor: theme.colors.subtleGray }}
                  />
                )}>
                <TabView tabLabel={'Preview'} style={{ flex: 1 }}>
                  {renderCardPreview(formik)}
                </TabView>
                <TabView tabLabel={'Edit'} style={{ flex: 1 }}>
                  {renderContentEditor(formik)}
                </TabView>
                <TabView tabLabel={'Schedule'} style={{ flex: 1 }}>
                  {renderScheduleEditor(formik)}
                </TabView>
              </ScrollableTabView>
            </View>
          </>
        )}
      </Formik>
    </AvoidSoftInputView>
  );
});

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  tabContentContainer: {
    flex: 1,
    marginBottom: 50,
  },
  tabContainer: {
    backgroundColor: theme.colors.white,
  },
  tabIndicator: {
    backgroundColor: theme.colors.brandSecondary,
    height: 3,
  },
  activeTabTitle: {
    ...theme.styles.textSmall,
  },
  inactiveTabTitle: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
  },
  cardPreview: {
    backgroundColor: theme.colors.viewBackground,
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
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