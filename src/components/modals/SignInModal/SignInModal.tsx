import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  SignInModalMethods,
  SignInModalProps,
  SignInNavigatorParamList,
} from './types';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ChooseSignInScreen from './ChooseSignInScreen';
import CreateAccountScreen from './CreateAccountScreen';
import EmailSignInScreen from './EmailSignInScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { Modal } from '@react-native-ajp-elements/ui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'theme';

const Stack = createNativeStackNavigator<SignInNavigatorParamList>();

type SignInModal = SignInModalMethods;

const SignInModal = React.forwardRef<SignInModal, SignInModalProps>(
  (_props, ref) => {
    const theme = useTheme();
    const innerRef = useRef<BottomSheetModalMethods>(null);

    const [signInMsg, setSignInMsg] = useState<string>();

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = (msg?: string) => {
      setSignInMsg(msg);
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
              initialParams={{ msg: signInMsg }}
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
