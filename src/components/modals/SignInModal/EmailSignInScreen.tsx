import * as Yup from 'yup';

import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppTheme, useTheme } from 'theme';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { Button } from '@rneui/base';
import { ListItemInput } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignInNavigatorParamList } from './types';
import { makeStyles } from '@rneui/themed';
import { signInwithEmailAndPassword } from 'lib/auth';
import { useSetState } from '@react-native-ajp-elements/core';

enum Fields {
  email,
  password,
}

type FormValues = {
  email: string;
  password: string;
};

export interface EditorState {
  isSubmitting: boolean;
  focusedField?: number;
  fieldCount: number;
}

export type Props = NativeStackScreenProps<
  SignInNavigatorParamList,
  'EmailSignInScreen'
>;

const EmailSignInScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refEmail = useRef<TextInput>(null);
  const refPassword = useRef<TextInput>(null);

  // Same order as on form.
  const fieldRefs = [refEmail.current, refPassword.current];

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [editorState, setEditorState] = useSetState<EditorState>({
    fieldCount: fieldRefs.length,
    focusedField: undefined,
    isSubmitting: false,
  });

  // const next = () => {
  //   if (editorState.focusedField === undefined) return;
  //   const nextField = editorState.focusedField + 1;
  //   fieldRefs[nextField]?.focus();
  //   setEditorState({ focusedField: nextField });
  // };

  // const previous = () => {
  //   if (editorState.focusedField === undefined) return;
  //   const nextField = editorState.focusedField - 1;
  //   fieldRefs[nextField]?.focus();
  //   setEditorState({ focusedField: nextField });
  // };

  const signIn = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    signInwithEmailAndPassword(values.email, values.password)
      .then(() => {
        setEditorState({ isSubmitting: false });
        resetForm({ values });
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        setEditorState({ isSubmitting: false });
        Alert.alert('Sign In Error', e.message, [{ text: 'OK' }], {
          cancelable: false,
        });
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Not a valid email address')
      .matches(/\..{2,}$/, 'Email domain needs min 2 characters') // Email domain at least 2 chars
      .required('Email address is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Minimum length 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Include uppercase, lowercase, number and special character',
      ),
  });

  return (
    <>
      <AvoidSoftInputView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: '100%' }}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              email: '',
              password: '',
            }}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={signIn}>
            {formik => (
              <View style={[theme.styles.viewAlt, s.view]}>
                <ListItemInput
                  refInner={refEmail}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.email}
                  errorText={
                    formik.values.email !== formik.initialValues.email
                      ? formik.errors.email
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  onBlur={() => {
                    formik.handleBlur('email');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('email')}
                  onFocus={() => setEditorState({ focusedField: Fields.email })}
                />
                <ListItemInput
                  refInner={refPassword}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={formik.values.password}
                  secureTextEntry={!passwordVisible}
                  rightImage={passwordVisible ? 'eye-off' : 'eye'}
                  rightImageColor={theme.colors.black}
                  rightImageOnPress={() => setPasswordVisible(!passwordVisible)}
                  rightImageType={'material-community'}
                  errorText={
                    formik.values.password !== formik.initialValues.password
                      ? formik.errors.password
                      : undefined
                  }
                  errorColor={theme.colors.error}
                  onBlur={() => {
                    formik.handleBlur('password');
                    setEditorState({ focusedField: undefined });
                  }}
                  onChangeText={formik.handleChange('password')}
                  onFocus={() => {
                    setEditorState({ focusedField: Fields.password });
                  }}
                />
                <Button
                  title={'Continue'}
                  titleStyle={theme.styles.buttonTitle}
                  buttonStyle={theme.styles.button}
                  containerStyle={s.continueButtonContainer}
                  disabled={!(formik.dirty && formik.isValid)}
                  loading={editorState.isSubmitting}
                  onPress={formikRef.current?.submitForm}
                />
                <Button
                  title={'Forgot Password?'}
                  titleStyle={s.forgotPassword}
                  buttonStyle={theme.styles.buttonClear}
                  containerStyle={s.forgotPasswordButtonContainer}
                  onPress={() => navigation.navigate('ForgotPasswordScreen')}
                />
                <Text style={s.footer}>
                  {'By signing up you agree to our Terms and Privacy Policy'}
                </Text>
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
};

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    paddingTop: 30,
  },
  continueButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
  forgotPasswordButtonContainer: {
    marginTop: 15,
  },
  forgotPassword: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
  },
  footer: {
    ...theme.styles.textSmall,
    ...theme.styles.textDim,
    alignSelf: 'center',
    textAlign: 'center',
    position: 'absolute',
    bottom: 40,
    marginHorizontal: 40,
  },
}));

export default EmailSignInScreen;
