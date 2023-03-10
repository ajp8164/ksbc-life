import { EditSermonModalMethods, EditSermonModalProps } from './types';
import React, { useImperativeHandle, useRef, useState } from 'react';
import SermonEditorView, {
  EditorState,
} from 'components/admin/views/SermonEditorView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';

type EditSermonModal = EditSermonModalMethods;

const EditSermonModal = React.forwardRef<EditSermonModal, EditSermonModalProps>(
  (_props, ref) => {
    const innerRef = useRef<BottomSheetModalMethods>(null);
    const sermonEditorViewRef = useRef<SermonEditorView>(null);

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
            sermonEditorViewRef.current?.saveSermon().then(() => dismiss());
          }}
        />
        <SermonEditorView ref={sermonEditorViewRef} onChange={setEditorState} />
      </Modal>
    );
  },
);

export { EditSermonModal };
