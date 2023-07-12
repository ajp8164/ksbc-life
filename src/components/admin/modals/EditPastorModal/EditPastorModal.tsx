import { EditPastorModalMethods, EditPastorModalProps } from './types';
import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import PastorEditorView, {
  EditorState,
} from 'components/admin/views/PastorEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Pastor } from 'types/pastor';

type EditPastorModal = EditPastorModalMethods;

const EditPastorModal = React.forwardRef<
  EditPastorModal,
  EditPastorModalProps
>((_props, ref) => {
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const pastorEditorViewRef = useRef<PastorEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [pastor, setPastor] = useState<Pastor>();
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string, pastor?: Pastor) => {
    setTitle(title);
    setPastor(pastor);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          pastorEditorViewRef.current
            ?.savePastor()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <PastorEditorView
        ref={pastorEditorViewRef}
        pastor={pastor}
        onEditorStateChange={setEditorState}
      />
    </Modal>
  );
});

export { EditPastorModal };
