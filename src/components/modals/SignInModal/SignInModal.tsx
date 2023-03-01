import {
  SignInModalMethods,
  SignInModalProps,
  SignInNavigatorParamList,
} from './types';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import { NavigationContainer } from '@react-navigation/native';
import ChooseSignInScreen from './ChooseSignInScreen';
import EmailSignInScreen from './EmailSignInScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import CreateAccountScreen from './CreateAccountScreen';
import { useTheme } from 'theme';

const Stack = createNativeStackNavigator<SignInNavigatorParamList>();

type SignInModal = SignInModalMethods;

const SignInModal = React.forwardRef<SignInModal, SignInModalProps>(
  (_props, ref) => {
    const theme = useTheme();
    const innerRef = useRef<BottomSheetModalMethods>(null);

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = () => {
      innerRef.current?.present();
    };

    return (
      <Modal
        ref={innerRef}
        backgroundStyle={{ backgroundColor: theme.colors.viewAltBackground }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.black }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{}}>
            <Stack.Screen
              name="ChooseSignInScreen"
              component={ChooseSignInScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EmailSignInScreen"
              component={EmailSignInScreen}
              options={{
                headerTitle: 'Sign In',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{
                headerTitle: 'Forgot Password?',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
              options={{
                headerTitle: 'Create Account',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Modal>
    );
  },
);

export { SignInModal };
