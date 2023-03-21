import React from 'react';
import { SermonVideo } from 'types/sermonVideo';

export declare type SermonVideoPickerModal = SermonVideoPickerModalMethods;

declare const SermonideoPickerModal: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    SermonVideoPickerModalProps &
      React.RefAttributes<SermonVideoPickerModalMethods>
  >
>;

export interface SermonVideoPickerModalProps {
  onChange: (video: SermonVideo) => void;
  value?: SermonVideo;
}

export interface SermonVideoPickerModalMethods {
  dismiss: () => void;
  present: () => void;
}
