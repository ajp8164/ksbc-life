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
import { BibleReference } from 'types/bible';
import { BibleVersePickerModal } from 'components/admin/modals/BibleVersePickerModal';
import { DatePickerModal } from 'components/modals/DatePickerModal';
import { DateTime } from 'luxon';
import FormikEffect from 'components/atoms/FormikEffect';
import { ItemPickerModal } from 'components/modals/ItemPickerModal';
import { Sermon } from 'types/church';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';
import { uuidv4 } from 'lib/uuid';

enum Fields {
  guestPasteur,
  title,
  seriesTitle,
  lifeApplicationTitle,
  lifeApplication1,
  lifeApplication2,
  lifeApplication3,
  lifeApplication4,
  lifeApplication5,
  videoId,
}

type FormValues = {
  guestPasteur: string;
  title: string;
  seriesTitle: string;
  lifeApplicationTitle: string;
  lifeApplication1: string;
  lifeApplication2: string;
  lifeApplication3: string;
  lifeApplication4: string;
  lifeApplication5: string;
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
  const [bibleReference, setBibleReference] = useState<BibleReference>();
  const [bibleReferenceStr, setBibleReferenceStr] = useState<string>();
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
  const refLifeApplicationTitle = useRef<TextInput>(null);
  const refLifeApplication1 = useRef<TextInput>(null);
  const refLifeApplication2 = useRef<TextInput>(null);
  const refLifeApplication3 = useRef<TextInput>(null);
  const refLifeApplication4 = useRef<TextInput>(null);
  const refLifeApplication5 = useRef<TextInput>(null);
  const refVideoId = useRef<TextInput>(null);

  // Same order as on form.
  const fieldRefs = [
    refGuestPasteur.current,
    refTitle.current,
    refSeriesTitle.current,
    refLifeApplicationTitle.current,
    refLifeApplication1.current,
    refLifeApplication2.current,
    refLifeApplication3.current,
    refLifeApplication4.current,
    refLifeApplication5.current,
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
      id: uuidv4(),
      date: DateTime.fromJSDate(date).toISO(),
      pasteur: pasteur === 'Guest' ? values.guestPasteur : pasteur,
      title: values.title,
      seriesTitle: values.seriesTitle,
      bibleReference,
      videoId: values.videoId,
      lifeApplication: {
        title: values.lifeApplicationTitle,
        items: [
          values.lifeApplication1,
          values.lifeApplication1,
          values.lifeApplication2,
          values.lifeApplication3,
          values.lifeApplication4,
          values.lifeApplication5,
        ],
      },
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

  const onBibleVerseChange = (bibleReference: BibleReference): void => {
    setBibleReference(bibleReference);
    setBibleReferenceStr(
      bibleReference.verse.end.length > 0
        ? `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}-${bibleReference.verse.end}`
        : `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}`,
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
    lifeApplicationTitle: Yup.string(),
    lifeApplication1: Yup.string(),
    lifeApplication2: Yup.string(),
    lifeApplication3: Yup.string(),
    lifeApplication4: Yup.string(),
    lifeApplication5: Yup.string(),
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
              lifeApplicationTitle: '',
              lifeApplication1: '',
              lifeApplication2: '',
              lifeApplication3: '',
              lifeApplication4: '',
              lifeApplication5: '',
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
                  value={bibleReferenceStr}
                  onPress={() => bibleVersePickerModalRef.current?.present()}
                />
                <Divider text={'LIFE APPLICATION'} />
                <ListItemInput
                  refInner={refLifeApplicationTitle}
                  placeholder={'Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.lifeApplicationTitle}
                  errorText={formik.errors.lifeApplicationTitle}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('lifeApplicationTitle')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('lifeApplicationTitle')}
                  onFocus={() =>
                    setEditorState({
                      focusedField: Fields.lifeApplicationTitle,
                    })
                  }
                />
                <ListItemInput
                  refInner={refLifeApplication1}
                  placeholder={'Enter text'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.lifeApplication1}
                  errorText={formik.errors.lifeApplication1}
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('lifeApplication1')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('lifeApplication1')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.lifeApplication1 })
                  }
                />
                {lifeApplicationCount >= 2 && (
                  <ListItemInput
                    refInner={refLifeApplication2}
                    placeholder={'Enter text'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.lifeApplication2}
                    errorText={formik.errors.lifeApplication2}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('lifeApplication2')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('lifeApplication2')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.lifeApplication2 })
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
                          formik.setFieldValue('lifeApplication2', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 3 && (
                  <ListItemInput
                    refInner={refLifeApplication3}
                    placeholder={'Enter text'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.lifeApplication3}
                    errorText={formik.errors.lifeApplication3}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('lifeApplication3')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('lifeApplication3')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.lifeApplication3 })
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
                          formik.setFieldValue('lifeApplication3', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 4 && (
                  <ListItemInput
                    refInner={refLifeApplication4}
                    placeholder={'Enter text'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.lifeApplication4}
                    errorText={formik.errors.lifeApplication4}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('lifeApplication4')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('lifeApplication4')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.lifeApplication4 })
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
                          formik.setFieldValue('lifeApplication4', '');
                        }}
                      />
                    }
                  />
                )}
                {lifeApplicationCount >= 5 && (
                  <ListItemInput
                    refInner={refLifeApplication5}
                    placeholder={'Enter text'}
                    placeholderTextColor={theme.colors.textPlaceholder}
                    value={formik.values.lifeApplication5}
                    errorText={formik.errors.lifeApplication5}
                    errorColor={theme.colors.error}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onBlur={(
                      e: NativeSyntheticEvent<TextInputFocusEventData>,
                    ) => {
                      formik.handleBlur('lifeApplication5')(e);
                      setEditorState({ focusedField: undefined });
                    }}
                    onChangeText={formik.handleChange('lifeApplication5')}
                    onFocus={() =>
                      setEditorState({ focusedField: Fields.lifeApplication5 })
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
                          formik.setFieldValue('lifeApplication5', '');
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
