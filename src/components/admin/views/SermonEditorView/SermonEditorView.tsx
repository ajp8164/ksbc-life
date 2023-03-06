import * as Yup from 'yup';

import { AppTheme, useTheme } from 'theme';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { Keyboard, ScrollView, TextInput, View } from 'react-native';
import { ListItem, ListItemInput } from '@react-native-ajp-elements/ui';
import React, { useRef } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { BibleVersePickerModal } from 'components/admin/modals/BibleVersePickerModal';
import { DatePickerModal } from 'components/modals/DatePickerModal';
import { DateTime } from 'luxon';
import { ItemPickerModal } from 'components/modals/ItemPickerModal';
import { SermonEditorViewMethods } from './types';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  date,
  title,
  pasteur,
  seriesTitle,
  bibleRef,
  videoId,
  applicationTitle,
  application1,
  application2,
  application3,
  application4,
  application5,
}

type FormValues = {
  date: string;
  title: string;
  pasteur: string;
  seriesTitle: string;
  bibleRef: string;
  videoId: string;
  applicationTitle: string;
  application1: string;
  application2: string;
  application3: string;
  application4: string;
  application5: string;
};

export interface EditorState {
  isSubmitting: boolean;
  focusedField?: number;
  fieldCount: number;
}

type SermonEditorView = SermonEditorViewMethods;

const SermonEditorView = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const bibleVersePickerModalRef = useRef<ItemPickerModal>(null);
  const pasteurPickerModalRef = useRef<ItemPickerModal>(null);
  const sermonDatePickerModalRef = useRef<DatePickerModal>(null);

  const pasteurItems = [
    { label: 'Jamie Auton', value: 'Jamie Auton' },
    { label: 'Mike Metzger', value: 'Mike Metzger' },
    { label: 'Ryan Millar', value: 'Ryan Millar' },
    { label: 'Guest', value: 'Guest' },
  ];

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refDate = useRef<TextInput>(null);
  const refTitle = useRef<TextInput>(null);
  const refPasteur = useRef<TextInput>(null);
  const refSeriesTitle = useRef<TextInput>(null);
  const refBibleRef = useRef<TextInput>(null);
  const refVideoId = useRef<TextInput>(null);
  const refApplicationTitle = useRef<TextInput>(null);
  const refApplication1 = useRef<TextInput>(null);
  const refApplication2 = useRef<TextInput>(null);
  const refApplication3 = useRef<TextInput>(null);
  const refApplication4 = useRef<TextInput>(null);
  const refApplication5 = useRef<TextInput>(null);

  // Same order as on form.
  const fieldRefs = [
    refDate.current,
    refTitle.current,
    refPasteur.current,
    refSeriesTitle.current,
    refBibleRef.current,
    refVideoId.current,
    refApplicationTitle.current,
    refApplication1.current,
    refApplication2.current,
    refApplication3.current,
    refApplication4.current,
    refApplication5.current,
  ];

  const [_editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
  });

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    title: Yup.string().required('Title is required'),
    pasteur: Yup.string().required('Pasteur is required'),
    seriesTitle: Yup.string(),
    bibleRef: Yup.string().required('Bible reference is required'),
    videoId: Yup.string(),
    applicationTitle: Yup.string(),
    application1: Yup.string(),
    application2: Yup.string(),
    application3: Yup.string(),
    application4: Yup.string(),
    application5: Yup.string(),
  });

  const saveSermon = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    console.log('commit', values);
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
    console.log('date change', DateTime.fromJSDate(date).toISO());
  };

  const onPasteurChange = (pasteur: string): void => {
    console.log('pasteur', pasteur);
  };

  return (
    <>
      <AvoidSoftInputView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: '100%' }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              date: '',
              title: '',
              pasteur: '',
              seriesTitle: '',
              bibleRef: '',
              videoId: '',
              applicationTitle: '',
              application1: '',
              application2: '',
              application3: '',
              application4: '',
              application5: '',
            }}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={saveSermon}>
            {formik => (
              <View style={[theme.styles.viewAlt, s.view]}>
                <ListItem
                  title={'Date'}
                  onPress={() => sermonDatePickerModalRef.current?.present()}
                />
                <ListItem
                  title={'Paster'}
                  onPress={() => pasteurPickerModalRef.current?.present()}
                />
                <ListItem
                  title={'Bible Reference'}
                  onPress={() => bibleVersePickerModalRef.current?.present()}
                />
                <ListItemInput
                  refInner={refTitle}
                  placeholder="Title"
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.title}
                  errorText={
                    formik.values.title !== formik.initialValues.title
                      ? formik.errors.title
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('title');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('title')}
                  onFocus={() => setEditorState({ focusedField: Fields.title })}
                />
                <ListItemInput
                  refInner={refPasteur}
                  placeholder={'Pasteur Name'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.pasteur}
                  errorText={
                    formik.values.pasteur !== formik.initialValues.pasteur
                      ? formik.errors.pasteur
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('pasteur');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('pasteur')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.pasteur })
                  }
                />
                <ListItemInput
                  refInner={refSeriesTitle}
                  placeholder={'Series Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.seriesTitle}
                  errorText={
                    formik.values.seriesTitle !==
                    formik.initialValues.seriesTitle
                      ? formik.errors.seriesTitle
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('seriesTitle');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('seriesTitle')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.seriesTitle })
                  }
                />
                <ListItemInput
                  refInner={refBibleRef}
                  placeholder={'Bible Reference'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.bibleRef}
                  errorText={
                    formik.values.bibleRef !== formik.initialValues.bibleRef
                      ? formik.errors.bibleRef
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('bibleRef');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('bibleRef')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.bibleRef })
                  }
                />
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
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('videoId')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.videoId })
                  }
                />
                <ListItemInput
                  refInner={refApplicationTitle}
                  placeholder={'Life Application Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.applicationTitle}
                  errorText={
                    formik.values.applicationTitle !==
                    formik.initialValues.applicationTitle
                      ? formik.errors.applicationTitle
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('applicationTitle');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('applicationTitle')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.applicationTitle })
                  }
                />
                <ListItemInput
                  refInner={refApplication1}
                  placeholder={'Life Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application1}
                  errorText={
                    formik.values.application1 !==
                    formik.initialValues.application1
                      ? formik.errors.application1
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('application1');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application1')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application1 })
                  }
                />
                <ListItemInput
                  refInner={refApplication2}
                  placeholder={'Life Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application2}
                  errorText={
                    formik.values.application2 !==
                    formik.initialValues.application2
                      ? formik.errors.application2
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('application2');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application2')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application2 })
                  }
                />
                <ListItemInput
                  refInner={refApplication3}
                  placeholder={'Life Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application3}
                  errorText={
                    formik.values.application3 !==
                    formik.initialValues.application3
                      ? formik.errors.application3
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('application3');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application3')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application3 })
                  }
                />
                <ListItemInput
                  refInner={refApplication4}
                  placeholder={'Life Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application4}
                  errorText={
                    formik.values.application4 !==
                    formik.initialValues.application4
                      ? formik.errors.application4
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('application4');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application4')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application4 })
                  }
                />
                <ListItemInput
                  refInner={refApplication5}
                  placeholder={'Life Application'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.application5}
                  errorText={
                    formik.values.application5 !==
                    formik.initialValues.application5
                      ? formik.errors.application5
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onBlur={() => {
                    formik.handleBlur('application5');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('application5')}
                  onFocus={() =>
                    setEditorState({ focusedField: Fields.application5 })
                  }
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
      <DatePickerModal
        ref={sermonDatePickerModalRef}
        title={'Sermon Date'}
        onValueChange={onDateChange}
      />
      <ItemPickerModal
        ref={pasteurPickerModalRef}
        placeholder={'Select Pasteur'}
        items={pasteurItems}
        onValueChange={onPasteurChange}
      />
      <BibleVersePickerModal
        ref={bibleVersePickerModalRef}
        onDismiss={bibleVerse => console.log('final', bibleVerse)}
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

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  view: {
    paddingTop: 30,
  },
}));

export default SermonEditorView;
