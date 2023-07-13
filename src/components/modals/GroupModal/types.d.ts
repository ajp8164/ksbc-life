import React from 'react';

export declare type GroupModal = GroupModalMethods;

declare const LegalModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    GroupModalProps & React.RefAttributes<GroupModalMethods>
  >
>;

export interface GroupModalProps {
  group: Group;
  snapPoints?: (string | number)[];
}

export interface GroupModalMethods {
  dismiss: () => void;
  present: () => void;
}
