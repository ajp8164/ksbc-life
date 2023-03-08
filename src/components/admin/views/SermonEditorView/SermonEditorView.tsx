import * as Yup from 'yup';

import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import {
  Divider,
  ListItem,
  ListItemInput,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  SermonEditorViewMethods,
  SermonEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { BibleVerse } from 'types/bible';
import { BibleVersePickerModal } from 'components/admin/modals/BibleVersePickerModal';
import { DatePickerModal } from 'components/modals/DatePickerModal';
import { DateTime } from 'luxon';
import FormikEffect from 'components/atoms/FormikEffect';
import { ItemPickerModal } from 'components/modals/ItemPickerModal';
import { Sermon } from 'types/church';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  guestPasteur,
  title,
  seriesTitle,
  applicationTitle,
  application1,
  application2,
  application3,
  application4,
  application5,
  videoId,
}

type FormValues = {
  guestPasteur: string;
  title: string;
  seriesTitle: string;
  applicationTitle: string;
  application1: string;
  application2: string;
  application3: string;
  application4: string;
  application5: string;
  videoId: string;
};

type SermonEditorView = SermonEditorViewMethods;

const SermonEditorView = React.forwardRef<
  SermonEditorView,
  SermonEditorViewProps
>((props, ref) => {
  const { onChange } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const bibleVersePickerModalRef = useRef<ItemPickerModal>(null);
  const pasteurPickerModalRef = useRef<ItemPickerModal>(null);
  const sermonDatePickerModalRef = useRef<DatePickerModal>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [pasteur, setPasteur] = useState<string>('Jamie Auton');
  const [bibleVerse, setBibleVerse] = useState<BibleVerse>();
  const [bibleVerseString, setBibleVerseString] = useState<string>();
  const [lifeApplicationCount, setLifeApplicationCount] = useState(1);

  const pasteurItems = [
    { label: 'Jamie Auton', value: 'Jamie Auton' },
    { label: 'Mike Metzger', value: 'Mike Metzger' },
    { label: 'Ryan Millar', value: 'Ryan Millar' },
    { label: 'Guest', value: 'Guest' },
  ];

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refGuestPasteur = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);
  const refSeriesTitle = useRef<TextInput>(null);
  const refApplicationTitle = useRef<TextInput>(null);
  const refApplication1 = useRef<TextInput>(null);
  const refApplication2 = useRef<TextInput>(null);
  const refApplication3 = useRef<TextInput>(null);
  const refApplication4 = useRef<TextInput>(null);
  const refApplication5 = useRef<TextInput>(null);
  const refVideoId = useRef<TextInput>(null);

  // Same order as on form.
  const fieldRefs = [
    refGuestPasteur.current,
    refTitle.current,
    refSeriesTitle.current,
    refApplicationTitle.current,
    refApplication1.current,
    refApplication2.current,
    refApplication3.current,
    refApplication4.current,
    refApplication5.current,
    refVideoId.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    isValid: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveSermon,
  }));

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveSermon = async () => {
    formikRef.current?.submitForm();
  };

  const save = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    const sermon: Sermon = {
      date: DateTime.fromJSDate(date).toISO(),
      pasteur: pasteur === 'Guest' ? values.guestPasteur : pasteur,
      title: values.title,
      seriesTitle: values.seriesTitle,
      bibleRef: bibleVerse,
      videoId: values.videoId,
      applicationTitle: values.applicationTitle,
      application1: values.application1,
      application2: values.application2,
      application3: values.application3,
      application4: values.application4,
      application5: values.application5,
    };
    console.log('commit', sermon);

    resetForm({ values });
    // commitSermon(values)
    //   .then(() => {
    //     setEditorState({ isSubmitting: false });
    //     resetForm({ values });
    //   })
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .catch((e: any) => {
    //     setEditorState({ isSubmitting: false });
    //     Alert.alert('Not  Saved', e.message, [{ text: 'OK' }], {
    //       cancelable: false,
    //     });
    //   });
  };

  const onDateChange = (date: Date): void => {
    setDate(date);
    console.log(date);
  };

  const onPasteurChange = (pasteur: string): void => {
    setPasteur(pasteur);
    setTimeout(() => {
      formikRef.current?.validateForm();
    }, 300); // Wait for pasteur value to update for yup validator.
  };

  const onBibleVerseChange = (bibleVerse: BibleVerse): void => {
    setBibleVerse(bibleVerse);
    setBibleVerseString(
      bibleVerse.verse.end.length > 0
        ? `${bibleVerse.book} ${bibleVerse.chapter}:${bibleVerse.verse.start}-${bibleVerse.verse.end}`
        : `${bibleVerse.book} ${bibleVerse.chapter}:${bibleVerse.verse.start}`,
    );
  };

  const validationSchema = Yup.object().shape({
    guestPasteur: Yup.string().when([], {
      is: () => pasteur === 'Guest',
      then: Yup.string().required('Pasteur is required'),
      otherwise: Yup.string().notRequired(),
    }),
    title: Yup.string().required('Title is required'),
    seriesTitle: Yup.string(),
    applicationTitle: Yup.string(),
    application1: Yup.string(),
    application2: Yup.string(),
    application3: Yup.string(),
    application4: Yup.string(),
    application5: Yup.string(),
    videoId: Yup.string(),
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
              guestPasteur: '',
              title: '',
              seriesTitle: '',
              applicationTitle: '',
              application1: '',
              application2: '',
              application3: '',
              application4: '',
              application5: '',
              videoId: '',
            }}
            validateOnChange={true}
            validateOnMount={true}
            validateOnBlur={true}
            validationSchema={validationSchema}
            onSubmit={save}>
            {formik => (
              <View style={[theme.styles.viewAlt, s.view]}>
                <FormikEffect
                  formik={formik}
                  onChange={(currentFormikState, previousFormikState) => {
                    if (
                      currentFormikState?.isValid !==
                      previousFormikState?.isValid
                    ) {
                      setEditorState({ isValid: currentFormikState.isValid });
                    }
                  }}
                />
                <ListItem
                  title={'Date'}
                  value={DateTime.fromJSDate(date).toFormat('MMM d, yyyy')}
                  onPress={() => sermonDatePickerModalRef.current?.present()}
                />
                <ListItem
                  title={'Paster'}
                  value={pasteur}
                  onPress={() => pasteurPickerModalRef.current?.present()}
                />
                {pasteur === 'Guest' && (
                  <ListItemInput
                    refInner={refGuestPasteur}
                    placeholder={'Guest Pasteur Name'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.guestPasteur}
                    errorText={formik.errors.guestPasteur}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('guestPasteur')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('guestPasteur')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.guestPasteur })
                    }
                  />
                )}
                <Divider />
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
                <ListItemInput
                  refInner={refSeriesTitle}
                  placeholder={'Series Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.seriesTitle}
                  errorText={formik.errors.seriesTitle}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('seriesTitle')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('seriesTitle')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.seriesTitle })
                  }
                />
                <ListItem
                  title={'Bible Reference'}
                  value={bibleVerseString}
                  onPress={() => bibleVersePickerModalRef.current?.present()}
                />
                <Divider text={'LIFE APPLICATION'} />
                <ListItemInput
                  refInner={refApplicationTitle}
                  placeholder={'Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.applicationTitle}
                  errorText={formik.errors.applicationTitle}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('applicatonTitle')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('applicationTitle')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.applicationTitle })
                  }
                />
                <ListItemInput
                  refInner={refApplication1}
                  placeholder={'Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application1}
                  errorText={formik.errors.application1}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('application1')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application1')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application1 })
                  }
                />
                {lifeApplicationCount >= 2 && (
                  <ListItemInput
                    refInner={refApplication2}
                    placeholder={'Application'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.application2}
                    errorText={formik.errors.application2}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('application2')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('application2')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.application2 })
                    }
                    rightImage={
                      <Icon
                        name={'close-circle'}
                        type={'material-community'}
                        color={theme.colors.assertive}
                        size={28}
                        containerStyle={{ left: 20 }}
                        style={{ width: 30 }}
                        onPress={() => {
                          setLifeApplicationCount(lifeApplicationCount - 1);
                          formik.setFieldValue('application2', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 3 && (
                  <ListItemInput
                    refInner={refApplication3}
                    placeholder={'Application'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.application3}
                    errorText={formik.errors.application3}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('application3')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('application3')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.application3 })
                    }
                    rightImage={
                      <Icon
                        name={'close-circle'}
                        type={'material-community'}
                        color={theme.colors.assertive}
                        size={28}
                        containerStyle={{ left: 20 }}
                        style={{ width: 30 }}
                        onPress={() => {
                          setLifeApplicationCount(lifeApplicationCount - 1);
                          formik.setFieldValue('application3', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 4 && (
                  <ListItemInput
                    refInner={refApplication4}
                    placeholder={'Application'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.application4}
                    errorText={formik.errors.application4}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('application4')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('application4')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.application4 })
                    }
                    rightImage={
                      <Icon
                        name={'close-circle'}
                        type={'material-community'}
                        color={theme.colors.assertive}
                        size={28}
                        containerStyle={{ left: 20 }}
                        style={{ width: 30 }}
                        onPress={() => {
                          setLifeApplicationCount(lifeApplicationCount - 1);
                          formik.setFieldValue('application4', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 5 && (
                  <ListItemInput
                    refInner={refApplication5}
                    placeholder={'Application'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.application5}
                    errorText={formik.errors.application5}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('application5')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('application5')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.application5 })
                    }
                    rightImage={
                      <Icon
                        name={'close-circle'}
                        type={'material-community'}
                        color={theme.colors.assertive}
                        size={28}
                        containerStyle={{ left: 20 }}
                        style={{ width: 30 }}
                        onPress={() => {
                          setLifeApplicationCount(lifeApplicationCount - 1);
                          formik.setFieldValue('application5', '');
                        }}
                      />
                    }
                  />
                )}
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    type={'clear'}
                    containerStyle={{ alignItems: 'flex-start' }}
                    disabled={lifeApplicationCount >= 5}
                    icon={
                      <Icon
                        name="plus"
                        type={'material-community'}
                        color={theme.colors.brandSecondary}
                        size={28}
                        style={
                          lifeApplicationCount >= 5 ? { opacity: 0.2 } : {}
                        }
                      />
                    }
                    onPress={() =>
                      setLifeApplicationCount(lifeApplicationCount + 1)
                    }
                  />
                  {lifeApplicationCount >= 5 && (
                    <Text
                      style={[
                        theme.styles.textSmall,
                        theme.styles.textDim,
                        { top: 15 },
                      ]}>
                      {'Maximum of 5 Life Applications allowed.'}
                    </Text>
                  )}
                </View>
                <Divider text={'VIDEO'} />
                <ListItemInput
                  refInner={refVideoId}
                  placeholder={'Video Id'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.videoId}
                  errorText={
                    formik.values.videoId !== formik.initialValues.videoId
                      ? formik.errors.videoId
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('videoId');
                    formik.setTouched({ videoId: true });
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('videoId')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.videoId })
                  }
                />
                <Divider
                  type={'note'}
                  text={'Get the video id from YouTube.'}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
      <DatePickerModal
        ref={sermonDatePickerModalRef}
        value={date}
        onValueChange={onDateChange}
      />
      <ItemPickerModal
        ref={pasteurPickerModalRef}
        placeholder={'none'}
        items={pasteurItems}
        value={pasteur}
        onValueChange={onPasteurChange}
      />
      <BibleVersePickerModal
        ref={bibleVersePickerModalRef}
        onDismiss={onBibleVerseChange}
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

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  view: {
    // paddingTop: 30,
  },
}));

export default SermonEditorView;
