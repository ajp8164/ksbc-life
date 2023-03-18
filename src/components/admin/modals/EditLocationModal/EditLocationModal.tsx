import { EditLocationModalMethods, EditLocationModalProps } from './types';
import LocationEditorView, {
  EditorState,
} from 'components/admin/views/LocationEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Location } from 'types/location';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';

type EditLocationModal = EditLocationModalMethods;

const EditLocationModal = React.forwardRef<
  EditLocationModal,
  EditLocationModalProps
>((_props, ref) => {
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const LocationEditorViewRef = useRef<LocationEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [location, setLocation] = useState<Location>();
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string, location?: Location) => {
    setTitle(title);
    setLocation(location);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          LocationEditorViewRef.current
            ?.saveLocation()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <LocationEditorView
        ref={LocationEditorViewRef}
        location={location}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditLocationModal };
