import React from 'react';

export declare type SignInView = SignInViewMethods;

declare const SignInView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SignInViewrops & React.RefAttributes<SignInViewMethods>
  >
>;

export interface SignInViewProps {
  onAuthStateChanged: (user: FirebaseAuthTypes.User) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignInViewMethods {}
