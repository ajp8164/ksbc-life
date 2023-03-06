import React from 'react';

export declare type DatePickerModal = DatePickerModalMethods;

declare const DatePickerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    DatePickerModalProps & React.RefAttributes<DatePickerModalMethods>
  >
>;

export interface DatePickerModalProps {
  onValueChange: (date: Date) => void;
  title?: string;
}

export interface DatePickerModalMethods {
  dismiss: () => void;
  present: () => void;
}
