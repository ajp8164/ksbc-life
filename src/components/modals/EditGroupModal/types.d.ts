import React from 'react';

export declare type EditGroupModal = EditGroupModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    EditGroupModalProps & React.RefAttributes<EditGroupModalMethods>
  >
>;

export interface EditGroupModalProps {
  group: Group;
  snapPoints?: (string | number)[];
}

export interface EditGroupModalMethods {
  dismiss: () => void;
  present: () => void;
}
