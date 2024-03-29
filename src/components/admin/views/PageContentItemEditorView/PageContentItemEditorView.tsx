import * as ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';

import {
  Alert,
  Appearance,
  Keyboard,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon, Image } from '@rneui/base';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  Divider,
  ListItem,
  ListItemCheckbox,
  ListItemInput,
  ListItemSwitch,
  PickerItem,
  selectImage,
  viewport,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  PageContentItemEditorViewMethods,
  PageContentItemEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
  Image as ImageUpload,
  deleteImage,
  uploadImage,
} from 'firebase/storage';
import {
  PageContentItem,
  PageContentItemImageSize,
} from 'types/pageContentItem';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import { ellipsis, useSetState } from '@react-native-ajp-elements/core';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Card from 'components/molecules/Card';
import { DateTime } from 'luxon';
import { ExpandableSection } from 'react-native-ui-lib';
import FormikEffect from 'components/atoms/FormikEffect';
import ImageEditMenu from 'components/atoms/ImageEditMenu';
import InfoMessage from 'components/atoms/InfoMessage';
import { ItemPickerModal } from 'components/modals/ItemPickerModal';
import { PageContentItemAssignment } from 'types/pageContentItem';
import { TextModal } from 'components/modals/TextModal';
import { appConfig } from 'config';
import { savePageContentItem as commitPageContentItem } from 'firebase/firestore';
import { makeStyles } from '@rneui/themed';

const initialPageContentItem: PageContentItem = {
  name: '',
  kind: 'Card',
  assignment: PageContentItemAssignment.Ministries,
  ordinal: -1,
  content: {
    cardStyle: 'pageContentCardDefaultStyle',
    body: '',
    footer: '',
    header: '',
    imageSize: PageContentItemImageSize.Short,
    imageUrl: '',
    title: '',
  },
  schedule: {
    enabled: false,
    startDate: DateTime.now().toISO() || '',
    endDate: '',
  },
  status: 'active',
};

enum Fields {
  assignment,
  body,
  footer,
  header,
  name,
  imageSize,
  imageUrl,
  title,
}

type FormValues = PageContentItem;

type PageContentItemEditorView = PageContentItemEditorViewMethods;

const PageContentItemEditorView = React.forwardRef<
  PageContentItemEditorView,
  PageContentItemEditorViewProps
>((props, ref) => {
  const { pageContentItem, onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const bodyTextModalRef = useRef<TextModal>(null);
  const itemAssignmentPickerModalRef = useRef<ItemPickerModal>(null);

  const [expandedStartDate, setExpandedStartDate] = useState(false);
  const [expandedEndDate, setExpandedEndDate] = useState(false);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const tabsFormikRef = useRef<FormikProps<PageContentItem>>();
  const refName = useRef<TextInput>(null);
  const refFooter = useRef<TextInput>(null);
  const refHeader = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);

  const pageContentImageAsset = useRef<ImagePicker.Asset>();
  const [assignmentItems, setAssignmentItems] = useState<PickerItem[]>([]);

  // Same order as on form.
  const fieldRefs = [
    refName.current,
    refTitle.current,
    refHeader.current,
    refFooter.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderScene = ({ route }: any) => {
    if (!tabsFormikRef.current) return;
    switch (route.key) {
      case 'preview':
        return renderCardPreview(tabsFormikRef.current);
      case 'edit':
        return renderContentEditor(tabsFormikRef.current);
      case 'schedule':
        return renderScheduleEditor(tabsFormikRef.current);
      default:
        return null;
    }
  };

  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'preview', title: 'Preview' },
    { key: 'edit', title: 'Edit' },
    { key: 'schedule', title: 'Schedule' },
  ]);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    savePageContentItem,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  useEffect(() => {
    const items: PickerItem[] = [];
    Object.keys(PageContentItemAssignment).forEach(key => {
      items.push({
        label: key,
        value: key,
      });
    });
    setAssignmentItems(items);
  }, []);

  const savePageContentItem = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    await savePageContentImage();
    // Saving the image updates the form but form values are already passed in.
    // Overwrite the image value after saving the image to storage.
    values.content.imageSize =
      formikRef.current?.values.content.imageSize ||
      PageContentItemImageSize.Short;
    values.content.imageUrl = formikRef.current?.values.content.imageUrl || '';

    const s: PageContentItem = {
      name: values.name,
      kind: initialPageContentItem.kind,
      assignment: values.assignment,
      ordinal: pageContentItem?.ordinal || initialPageContentItem.ordinal,
      status: initialPageContentItem.status,
      content: values.content,
      schedule: values.schedule,
    };

    if (pageContentItem?.id) {
      s.id = pageContentItem.id;
    }

    try {
      await commitPageContentItem(s);
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

  const selectPageContentImage = () => {
    selectImage({
      onSuccess: imageAssets => {
        pageContentImageAsset.current = imageAssets[0];
        formikRef.current?.setFieldValue(
          'content.imageUrl',
          imageAssets[0].uri,
        );
      },
    });
  };

  const savePageContentImage = async () => {
    if (pageContentImageAsset.current) {
      await uploadImage({
        image: {
          mimeType: pageContentImageAsset.current.type,
          uri: pageContentImageAsset.current.uri,
        } as ImageUpload,
        storagePath: appConfig.storageImagePageContentItems,
        oldImage: pageContentItem?.content.imageUrl,
        onSuccess: url =>
          formikRef.current?.setFieldValue('content.imageUrl', url),
        onError: () => formikRef.current?.setFieldValue('content.imageUrl', ''),
      });
    }
  };

  const deletePageContentImage = async () => {
    if (formikRef.current?.values.content.imageUrl) {
      await deleteImage({
        filename: formikRef.current?.values.content.imageUrl,
        storagePath: appConfig.storageImagePageContentItems,
      })
        .then(() => {
          formikRef.current?.setFieldValue('content.imageUrl', '');
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

  const toggleScheduleEnabled = (value: boolean) => {
    formikRef.current?.setFieldValue('schedule.enabled', value);
  };

  const onStartDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    date &&
      formikRef.current?.setFieldValue(
        'schedule.startDate',
        DateTime.fromJSDate(date).toISO(),
      );
  };

  const onEndDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    date &&
      formikRef.current?.setFieldValue(
        'schedule.endDate',
        DateTime.fromJSDate(date).toISO(),
      );
  };

  const onAssignmentChange = (assignment: string): void => {
    formikRef.current?.setFieldValue('assignment', assignment);
  };

  const selectImageSize = (size: PageContentItemImageSize) => {
    formikRef.current?.setFieldValue('content.imageSize', size);
  };

  const toggleTransparentBackground = () => {
    formikRef.current?.setFieldValue(
      'content.cardStyle',
      formikRef.current?.values.content.cardStyle ===
        'pageContentCardDefaultStyle'
        ? 'pageContentCardTransparentStyle'
        : 'pageContentCardDefaultStyle',
    );
  };

  const validationSchema = Yup.object().shape({
    assignment: Yup.string(),
    body: Yup.string(),
    cardStyle: Yup.string(),
    footer: Yup.string(),
    header: Yup.string(),
    name: Yup.string().required('Content name is required'),
    imageSize: Yup.string(),
    imageUrl: Yup.string(),
    title: Yup.string(),
  });

  const renderCardPreview = (formik: FormikProps<FormValues>) => {
    const content = formik.values.content;
    const startDate = DateTime.fromISO(
      formik.values.schedule.startDate,
    ).toFormat('MMM d, yyyy');
    const endDate = formik.values.schedule.endDate
      ? DateTime.fromISO(formik.values.schedule.endDate).toFormat('MMM d, yyyy')
      : undefined;

    return (
      <>
        <BottomSheetScrollView
          style={{ backgroundColor: theme.colors.viewBackground }}>
          <Divider
            type={'note'}
            text={`This is what your card will look like when it is shown.`}
            subHeaderStyle={theme.styles.viewHorizontalInset}
          />
          <View style={s.cardPreview}>
            <Card
              title={content.title?.length > 0 ? content.title : undefined}
              header={content.header?.length > 0 ? content.header : undefined}
              body={content.body?.length > 0 ? content.body : undefined}
              footer={content.footer?.length > 0 ? content.footer : undefined}
              imageSource={
                content.imageUrl?.length > 0
                  ? { uri: content.imageUrl }
                  : undefined
              }
              imageHeight={Number(content.imageSize)}
              cardStyle={content.cardStyle || undefined}
              titleStyle={theme.styles.pageContentCardTitleStyle}
              headerStyle={theme.styles.pageContentCardHeaderStyle}
              footerStyle={theme.styles.pageContentCardFooterStyle}
              bodyStyle={theme.styles.pageContentCardBodyStyle}
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
          <View style={theme.styles.viewHorizontalInset}>
            <Divider />
            <ListItem
              title={'Page assignment'}
              subtitle={'The app page on which this card\nwill be seen.'}
              value={formik.values.assignment || 'None'}
              position={['first', 'last']}
              onPress={() => itemAssignmentPickerModalRef.current?.present()}
            />
            {formik.values.schedule.enabled ? (
              <InfoMessage
                text={
                  startDate === endDate
                    ? `This card will be shown on ${startDate} only.`
                    : !endDate
                    ? `This card will be shown starting on ${startDate}.`
                    : `This card will be shown between ${startDate} and ${endDate}.`
                }
              />
            ) : (
              <InfoMessage text={`This card is not scheduled to be shown.`} />
            )}
          </View>
        </BottomSheetScrollView>
      </>
    );
  };

  const renderContentEditor = (formik: FormikProps<FormValues>) => {
    return (
      <>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 15, paddingBottom: 100 }}>
          <View style={[theme.styles.viewAlt, { flex: 1 }]}>
            <Divider
              type={'note'}
              text={
                'Changes made here are immediatley applied to the card preview on the Preview tab.'
              }
            />
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
            <Divider />
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
              containerStyle={{
                backgroundColor: theme.colors.listItemBackgroundAlt,
              }}
              position={['first']}
              onPress={() => bodyTextModalRef.current?.present()}
            />
            <ListItemCheckbox
              title={'Transparent Background'}
              subtitle={'The card will be displayed without a background color'}
              checkedIcon={'check'}
              checkIconType={'material-community'}
              uncheckedIcon={'checkbox-blank-outline'}
              checkedColor={theme.colors.brandSecondary}
              checked={
                formik.values.content.cardStyle ===
                'pageContentCardTransparentStyle'
              }
              containerStyle={{
                backgroundColor: theme.colors.listItemBackgroundAlt,
                borderWidth: 0,
              }}
              wrapperStyle={{
                backgroundColor: theme.colors.listItemBackgroundAlt,
              }}
              position={['last']}
              onPress={toggleTransparentBackground}
            />
            {formik.values.content.imageUrl?.length ? (
              <>
                <Divider />
                <Image
                  source={{ uri: formik.values.content.imageUrl }}
                  containerStyle={s.imageContainer}>
                  <ImageEditMenu
                    heightValue={formik.values.content.imageSize}
                    onChangeImage={selectPageContentImage}
                    onHeightSelect={selectImageSize}
                    onRemoveImage={deletePageContentImage}>
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
                    />
                  </ImageEditMenu>
                </Image>
              </>
            ) : (
              <ListItem
                title={'Add a photo'}
                titleStyle={theme.styles.textPlaceholder}
                containerStyle={{ borderBottomWidth: 0 }}
                onPress={selectPageContentImage}
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
          <Divider
            type={'note'}
            text={
              'You can schedule when and how long this card is shown. This card will be shown to users during the selected time period only. An unscheduled card will not be shown.'
            }
          />
          <ListItemSwitch
            title={'Scheduled'}
            value={formik.values.schedule.enabled}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            position={['first']}
            onValueChange={toggleScheduleEnabled}
          />
          <ListItem
            title={'From'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            value={
              formik.values.schedule.startDate
                ? DateTime.fromISO(formik.values.schedule.startDate).toFormat(
                    'MMM d, yyyy',
                  )
                : 'Today'
            }
            onPress={() => setExpandedStartDate(!expandedStartDate)}
          />
          <ExpandableSection expanded={expandedStartDate}>
            <DateTimePicker
              mode={'date'}
              minimumDate={new Date()}
              style={
                Appearance.getColorScheme() !== 'light' ||
                theme.mode !== 'light'
                  ? {
                      backgroundColor: `${theme.colors.brandSecondary}60`,
                    }
                  : { backgroundColor: theme.colors.hintGray }
              }
              accentColor={theme.colors.brandSecondary}
              value={DateTime.fromISO(
                formik.values.schedule.startDate,
              ).toJSDate()}
              onChange={onStartDateChange}
            />
          </ExpandableSection>
          <ListItem
            title={'To'}
            containerStyle={{
              backgroundColor: theme.colors.listItemBackgroundAlt,
            }}
            value={
              formik.values.schedule.endDate
                ? DateTime.fromISO(formik.values.schedule.endDate).toFormat(
                    'MMM d, yyyy',
                  )
                : 'Indefinite'
            }
            position={['last']}
            onPress={() => setExpandedEndDate(!expandedEndDate)}
          />
          <ExpandableSection expanded={expandedEndDate}>
            <DateTimePicker
              mode={'date'}
              minimumDate={new Date()}
              style={
                Appearance.getColorScheme() !== 'light' ||
                theme.mode !== 'light'
                  ? {
                      backgroundColor: `${theme.colors.brandSecondary}60`,
                    }
                  : { backgroundColor: theme.colors.hintGray }
              }
              accentColor={theme.colors.brandSecondary}
              value={
                formik.values.schedule.endDate.length > 0
                  ? DateTime.fromISO(formik.values.schedule.endDate).toJSDate()
                  : new Date()
              }
              onChange={onEndDateChange}
            />
          </ExpandableSection>
        </View>
      </BottomSheetScrollView>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route }) => (
          <Text style={theme.styles.textNormal}>{route.title}</Text>
        )}
        indicatorStyle={{
          backgroundColor: theme.colors.brandSecondary,
          height: 5,
        }}
        style={{ backgroundColor: theme.colors.white }}
      />
    );
  };

  return (
    <>
      <AvoidSoftInputView
        style={[theme.styles.viewAlt, { paddingHorizontal: 0 }]}>
        <Formik
          innerRef={formikRef}
          initialValues={pageContentItem || initialPageContentItem}
          validateOnChange={true}
          validateOnMount={true}
          validateOnBlur={true}
          validationSchema={validationSchema}
          onSubmit={save}>
          {formik => {
            tabsFormikRef.current = formik;
            return (
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
                <TabView
                  navigationState={{ index: tabIndex, routes }}
                  renderScene={renderScene}
                  onIndexChange={setTabIndex}
                  initialLayout={{ width: viewport.width }}
                  renderTabBar={renderTabBar}
                />
              </>
            );
          }}
        </Formik>
      </AvoidSoftInputView>
      <ItemPickerModal
        ref={itemAssignmentPickerModalRef}
        placeholder={'none'}
        items={assignmentItems}
        value={formikRef.current?.values.assignment}
        onValueChange={onAssignmentChange}
      />
    </>
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
    paddingHorizontal: 15,
    // ...theme.styles.viewHorizontalInset,
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

export default PageContentItemEditorView;
