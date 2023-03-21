import { EditPasteurModalMethods, EditPasteurModalProps } from './types';
import PasteurEditorView, {
  EditorState,
} from 'components/admin/views/PasteurEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';
import { Pasteur } from 'types/pasteur';

type EditPasteurModal = EditPasteurModalMethods;

const EditPasteurModal = React.forwardRef<
  EditPasteurModal,
  EditPasteurModalProps
>((_props, ref) => {
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const pasteurEditorViewRef = useRef<PasteurEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [pasteur, setPasteur] = useState<Pasteur>();
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string, pasteur?: Pasteur) => {
    setTitle(title);
    setPasteur(pasteur);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          pasteurEditorViewRef.current
            ?.savePasteur()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <PasteurEditorView
        ref={pasteurEditorViewRef}
        pasteur={pasteur}
        onEditorStateChange={setEditorState}
      />
    </Modal>
  );
});

export { EditPasteurModal };
