import { Location } from 'types/location';
import React from 'react';

export declare type LocationEditorView = LocationEditorViewMethods;

declare const LocationEditorView: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    LocationEditorViewProps & React.RefAttributes<LocationEditorViewMethods>
  >
>;

export interface LocationEditorViewProps {
  location?: Location;
  onChange?: (editorState: EditorState) => void;
}

export interface LocationEditorViewMethods {
  saveLocation: () => Promise<void>;
}

export interface EditorState {
  fieldCount: number;
  focusedField?: number;
  isSubmitting: boolean;
  changed: boolean;
}
