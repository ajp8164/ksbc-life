import * as Yup from 'yup';

import { AppTheme, useTheme } from 'theme';
import {
  EditorState,
  PasteurEditorViewMethods,
  PasteurEditorViewProps,
} from './types';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  TextInputFocusEventData,
  View,
} from 'react-native';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import FormikEffect from 'components/atoms/FormikEffect';
import { ListItemInput } from '@react-native-ajp-elements/ui';
import { Pasteur } from 'types/church';
import { makeStyles } from '@rneui/themed';
import { useSetState } from '@react-native-ajp-elements/core';
import { uuidv4 } from 'lib/uuid';

enum Fields {
  firstName,
  lastName,
}

type FormValues = {
  firstName: string;
  lastName: string;
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

  // Same order as on form.
  const fieldRefs = [refFirstName.current, refLastName.current];

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
    formikRef.current?.submitForm();
  };

  const save = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    const updatedPasteur: Pasteur = {
      id: pasteur?.id || uuidv4(),
      firstName: values.firstName,
      lastName: values.lastName,
    };
    console.log('commit', updatedPasteur);

    resetForm({ values });
    // commitPasteur(values)
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

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
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
                <ListItemInput
                  refInner={refFirstName}
                  placeholder={'firstName'}
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
                  placeholder={'lastName'}
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

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  view: {
    // paddingTop: 30,
  },
}));

export default PasteurEditorView;
