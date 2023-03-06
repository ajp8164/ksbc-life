import React from 'react';

export declare type ItemPickerModal = ItemPickerModalMethods;

declare const ItemPickerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ItemPickerModalProps & React.RefAttributes<ItemPickerModalMethods>
  >
>;

export interface ItemPickerModalProps {
  items: PickerItem[] | PickerItem[][];
  itemWidth?: PickerWidth | PickerWidth[];
  labels?: string | string[];
  onValueChange: (value: string) => void;
  placeholder?: string | PickerItem | PickerItem[];
  title?: string;
}

export interface ItemPickerModalMethods {
  dismiss: () => void;
  present: () => void;
}
