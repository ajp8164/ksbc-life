import React from 'react';

export declare type SignInModal = SignInModalMethods;

declare const SignInModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SignInModalProps & React.RefAttributes<SignInModalMethods>
  >
>;

export interface SignInModalProps {
  onAuthStateChanged: (user: FirebaseAuthTypes.User) => void;
}

export interface SignInModalMethods {
  dismiss: () => void;
  present: () => void;
}
