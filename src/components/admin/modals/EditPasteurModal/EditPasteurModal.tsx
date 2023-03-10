import { EditPasteurModalMethods, EditPasteurModalProps } from './types';
import PasteurEditorView, {
  EditorState,
} from 'components/admin/views/PasteurEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';

type EditPasteurModal = EditPasteurModalMethods;

const EditPasteurModal = React.forwardRef<
  EditPasteurModal,
  EditPasteurModalProps
>((props, ref) => {
  const { pasteur } = props;

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const pasteurEditorViewRef = useRef<PasteurEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string) => {
    setTitle(title);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.isValid}
        onRightButtonPress={() => {
          pasteurEditorViewRef.current?.savePasteur().then(() => dismiss());
        }}
      />
      <PasteurEditorView
        ref={pasteurEditorViewRef}
        onChange={setEditorState}
        pasteur={pasteur}
      />
    </Modal>
  );
});

export { EditPasteurModal };
