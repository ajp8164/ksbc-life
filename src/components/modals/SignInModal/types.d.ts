import React from 'react';

export declare type SignInModal = SignInModalMethods;

declare const SignInModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SignInModalProps & React.RefAttributes<SignInModalMethods>
  >
>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignInModalProps {}

export interface SignInModalMethods {
  dismiss: () => void;
  present: (msg?: string) => void;
}

export type SignInNavigatorParamList = {
  ChooseSignInScreen: {
    msg?: string;
  };
  CreateAccountScreen: undefined;
  EmailSignInScreen: undefined;
  ForgotPasswordScreen: undefined;
};
