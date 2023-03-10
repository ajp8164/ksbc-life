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
import React, { useRef } from 'react';

import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import { Button } from '@rneui/base';
import { ListItemInput } from '@react-native-ajp-elements/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignInNavigatorParamList } from './types';
import { makeStyles } from '@rneui/themed';
import { sendPasswordResetEmail } from 'lib/auth';
import { useSetState } from '@react-native-ajp-elements/core';

type FormValues = {
  email: string;
};

export interface EditorState {
  isSubmitting: boolean;
}

export type Props = NativeStackScreenProps<
  SignInNavigatorParamList,
  'ForgotPasswordScreen'
>;

const ForgotPasswordScreen = () => {
  const theme = useTheme();
  const s = useStyles(theme);

  const formikRef = useRef<FormikProps<FormValues>>(null);
  const refEmail = useRef<TextInput>(null);

  const [editorState, setEditorState] = useSetState<EditorState>({
    isSubmitting: false,
  });

  const sendEmail = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    Keyboard.dismiss();
    setEditorState({ isSubmitting: true });
    sendPasswordResetEmail(values.email)
      .then(() => {
        setEditorState({ isSubmitting: false });
        resetForm({ values });
      })
      .catch(() => {
        setEditorState({ isSubmitting: false });
        Alert.alert(
          'Account Not Found',
          'There is no account with that address. Please check your email address and try again.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Not a valid email address')
      .matches(/\..{2,}$/, 'Email domain needs min 2 characters') // Email domain at least 2 chars
      .required('Email address is required'),
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
            }}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={sendEmail}>
            {formik => (
              <View style={[theme.styles.viewAlt, s.view]}>
                <Text style={s.description}>
                  {
                    "Enter your email address and we'll send a link to reset your password."
                  }
                </Text>
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
                  onBlur={formik.handleBlur('email')}
                  onChangeText={formik.handleChange('email')}
                />
                <Button
                  title={'Send'}
                  titleStyle={theme.styles.buttonTitle}
                  buttonStyle={theme.styles.button}
                  containerStyle={s.sendButtonContainer}
                  disabled={!(formik.dirty && formik.isValid)}
                  loading={editorState.isSubmitting}
                  onPress={formikRef.current?.submitForm}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </AvoidSoftInputView>
    </>
  );
};

const useStyles = makeStyles((_theme, __theme: AppTheme) => ({
  view: {
    paddingTop: 30,
  },
  sendButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
  description: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 30,
  },
}));

export default ForgotPasswordScreen;
