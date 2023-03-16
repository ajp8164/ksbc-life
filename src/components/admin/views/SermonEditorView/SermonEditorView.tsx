import * as Yup from 'yup';

import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Button, Icon } from '@rneui/base';
import {
  Divider,
  ListItem,
  ListItemInput,
  PickerItem,
} from '@react-native-ajp-elements/ui';
import {
  EditorState,
  SermonEditorViewMethods,
  SermonEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { LifeApplication, Sermon } from 'types/church';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { BibleReference } from 'types/bible';
import { BibleReferencePickerModal } from 'components/admin/modals/BibleReferencePickerModal';
import { DatePickerModal } from 'components/modals/DatePickerModal';
import { DateTime } from 'luxon';
import FormikEffect from 'components/atoms/FormikEffect';
import { ItemPickerModal } from 'components/modals/ItemPickerModal';
import { saveSermon as commitSermon } from 'firestore/sermons';
import { getPasteurs } from 'firestore/church';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  title,
  seriesTitle,
  lifeApplicationTitle,
  videoId,
}

type FormValues = {
  date: string;
  pasteur: string;
  title: string;
  seriesTitle: string;
  lifeApplication?: LifeApplication;
  videoId: string;
};

const MAX_LA = 5;
const lifeApplications = Array.from(Array(MAX_LA).keys());
type SermonEditorView = SermonEditorViewMethods;

const SermonEditorView = React.forwardRef<
  SermonEditorView,
  SermonEditorViewProps
>((props, ref) => {
  const { onChange, sermon } = props;

  const theme = useTheme();
  const s = useStyles(theme);

  const bibleReferencePickerModalRef = useRef<ItemPickerModal>(null);
  const pasteurPickerModalRef = useRef<ItemPickerModal>(null);
  const sermonDatePickerModalRef = useRef<DatePickerModal>(null);

  const [bibleReference, setBibleReference] = useState<BibleReference>({
    book: '',
    chapter: '',
    verse: { start: '', end: '' },
  });
  const [bibleReferenceStr, setBibleReferenceStr] = useState<string>();
  const [pasteurItems, setPasteurItems] = useState<PickerItem[]>([]);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refTitle = useRef<TextInput>(null);
  const refSeriesTitle = useRef<TextInput>(null);
  const refLifeApplicationTitle = useRef<TextInput>(null);
  const refVideoId = useRef<TextInput>(null);

  // Same order as on form.
  const fieldRefs = [
    refTitle.current,
    refSeriesTitle.current,
    refLifeApplicationTitle.current,
    refVideoId.current,
  ];

  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
    changed: false,
  });

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    saveSermon,
  }));

  useEffect(() => {
    (async () => {
      const items: PickerItem[] = [{ label: 'Select  Pastuer', value: '' }];
      (await getPasteurs()).forEach(p => {
        const name = `${p.firstName} ${p.lastName}`;
        items.push({ label: name, value: name });
      });
      setPasteurItems(items);
    })();
  }, []);

  useEffect(() => {
    onChange && onChange(editorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  const saveSermon = async () => {
    return formikRef.current?.submitForm();
  };

  const save = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });

    const s: Sermon = {
      date: values.date,
      pasteur: values.pasteur,
      title: values.title,
      seriesTitle: values.seriesTitle,
      bibleReference,
      videoId: values.videoId,
      lifeApplication: values.lifeApplication,
    };

    if (sermon?.id) {
      s.id = sermon.id;
    }

    try {
      await commitSermon(s);
      resetForm({ values });
      setEditorState({ isSubmitting: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setEditorState({ isSubmitting: false });
      Alert.alert('Sermon Not Saved', 'Please try again.', [{ text: 'OK' }], {
        cancelable: false,
      });
      throw e;
    }
  };

  const onDateChange = (date: Date): void => {
    formikRef.current?.setFieldValue('date', date.toISOString());
  };

  const onPasteurChange = (pasteur: string): void => {
    formikRef.current?.setFieldValue('pasteur', pasteur);
  };

  const onBibleReferenceChange = (bibleReference: BibleReference): void => {
    setBibleReference(bibleReference);
    setBibleReferenceStr(
      bibleReference.verse.end.length > 0
        ? `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}-${bibleReference.verse.end}`
        : `${bibleReference.book} ${bibleReference.chapter}:${bibleReference.verse.start}`,
    );
  };

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    pasteur: Yup.string().required('Pasteur is required'),
    title: Yup.string().required('Title is required'),
    seriesTitle: Yup.string(),
    lifeApplication: Yup.object().shape({
      title: Yup.string(),
      items: Yup.array().of(Yup.string()),
    }),
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
              date: sermon?.date || DateTime.now().toISODate(),
              pasteur: sermon?.pasteur || '',
              title: sermon?.title || '',
              seriesTitle: sermon?.seriesTitle || '',
              lifeApplication:
                sermon?.lifeApplication ||
                ({ title: '', items: [] } as LifeApplication),
              videoId: sermon?.videoId || '',
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
                <ListItem
                  title={'Date'}
                  value={DateTime.fromISO(formik.values.date).toFormat(
                    'MMM d, yyyy',
                  )}
                  onPress={() => sermonDatePickerModalRef.current?.present()}
                />
                <ListItem
                  title={'Paster'}
                  value={formik.values.pasteur || 'Pasteur is required'}
                  valueStyle={
                    !formik.values.pasteur
                      ? {
                          ...theme.styles.textTiny,
                          color: theme.colors.assertive,
                        }
                      : {}
                  }
                  onPress={() => pasteurPickerModalRef.current?.present()}
                />
                <Divider />
                <ListItemInput
                  refInner={refTitle}
                  placeholder={'Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.title}
                  errorText={formik.errors.title}
                  errorColor={theme.colors.error}
                  autoCorrect={true}
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
                  autoCorrect={true}
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
                  onPress={() =>
                    bibleReferencePickerModalRef.current?.present()
                  }
                />
                <Divider text={'LIFE APPLICATION'} />
                <ListItemInput
                  refInner={refLifeApplicationTitle}
                  placeholder={'Title'}
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.lifeApplication?.title || ''}
                  autoCorrect={true}
                  onBlur={(
                    e: NativeSyntheticEvent<TextInputFocusEventData>,
                  ) => {
                    formik.handleBlur('lifeApplication.title')(e);
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('lifeApplication.title')}
                  onFocus={() =>
                    setEditorState({
                      focusedField: Fields.lifeApplicationTitle,
                    })
                  }
                />
                {lifeApplications.map(n => {
                  if (formik.values.lifeApplication?.items[n] === undefined) {
                    return null;
                  }
                  return (
                    <ListItemInput
                      key={n}
                      placeholder={'Life application'}
                      placeholderTextColor={theme.colors.textPlaceholder}
                      value={
                        (formik.values.lifeApplication?.items[
                          n
                        ] as keyof typeof formik.values) || ''
                      }
                      autoCorrect={true}
                      onBlur={(
                        e: NativeSyntheticEvent<TextInputFocusEventData>,
                      ) => {
                        formik.handleBlur(`lifeApplication.items[${n}]`)(e);
                        setEditorState({ focusedField: undefined });
                      }}
                      onChangeText={formik.handleChange(
                        `lifeApplication.items[${n}]`,
                      )}
                      rightImage={
                        <Icon
                          name={'close-circle-outline'}
                          type={'material-community'}
                          color={theme.colors.lightGray}
                          size={28}
                          containerStyle={{ left: 20, position: 'absolute' }}
                          style={{ width: 30 }}
                          onPress={() => {
                            const items = ([] as string[]).concat(
                              formik.values.lifeApplication?.items || [],
                            );
                            items.splice(n, 1);
                            formik.setFieldValue(
                              `lifeApplication.items`,
                              items,
                            );
                          }}
                        />
                      }
                    />
                  );
                })}
                <View style={s.addLifeApplication}>
                  {formik.values.lifeApplication?.items &&
                    formik.values.lifeApplication?.items.length < MAX_LA && (
                      <Button
                        type={'clear'}
                        containerStyle={{ alignItems: 'flex-start' }}
                        icon={
                          <Icon
                            name="plus"
                            type={'material-community'}
                            color={theme.colors.brandSecondary}
                            size={28}
                          />
                        }
                        onPress={() => {
                          for (let i = 0; i < MAX_LA; i++) {
                            if (
                              formik.values.lifeApplication?.items[i] ===
                              undefined
                            ) {
                              const items = ([] as string[]).concat(
                                formik.values.lifeApplication?.items || [],
                              );
                              items[i] = '';
                              formik.setFieldValue(
                                'lifeApplication.items',
                                items,
                              );
                              break;
                            }
                          }
                        }}
                      />
                    )}
                  {formik.values.lifeApplication?.items &&
                    formik.values.lifeApplication?.items.length >= MAX_LA && (
                      <Text
                        style={[
                          theme.styles.textSmall,
                          theme.styles.textDim,
                          { top: 15, left: 10, marginBottom: 20 },
                        ]}>
                        {`Maximum of ${MAX_LA} Life Applications allowed`}
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
        value={
          formikRef.current?.values.date
            ? DateTime.fromISO(formikRef.current.values.date).toJSDate()
            : new Date()
        }
        onValueChange={onDateChange}
      />
      <ItemPickerModal
        ref={pasteurPickerModalRef}
        placeholder={'none'}
        items={pasteurItems}
        value={formikRef.current?.values.pasteur}
        onValueChange={onPasteurChange}
      />
      <BibleReferencePickerModal
        ref={bibleReferencePickerModalRef}
        onDismiss={onBibleReferenceChange}
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
  addLifeApplication: {
    flexDirection: 'row',
  },
}));

export default SermonEditorView;
