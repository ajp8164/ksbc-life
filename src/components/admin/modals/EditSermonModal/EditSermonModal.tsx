import { EditSermonModalMethods, EditSermonModalProps } from './types';
import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';
import SermonEditorView, {
  EditorState,
} from 'components/admin/views/SermonEditorView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Sermon } from 'types/sermon';

type EditSermonModal = EditSermonModalMethods;

const EditSermonModal = React.forwardRef<EditSermonModal, EditSermonModalProps>(
  (_props, ref) => {
    const innerRef = useRef<BottomSheetModalMethods>(null);
    const sermonEditorViewRef = useRef<SermonEditorView>(null);

    const [editorState, setEditorState] = useState({} as EditorState);
    const [sermon, setSermon] = useState<Sermon>();
    const [title, setTitle] = useState('');

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = (title: string, sermon?: Sermon) => {
      setTitle(title);
      setSermon(sermon);
      innerRef.current?.present();
    };

    return (
      <Modal ref={innerRef}>
        <ModalHeader
          title={title}
          rightButtonText={'Save'}
          rightButtonDisabled={!editorState.changed}
          onRightButtonPress={() => {
            sermonEditorViewRef.current
              ?.saveSermon()
              .then(dismiss)
              .catch(() => {
                // Nothing to do. Prevent unhandled promise.
              });
          }}
        />
        <SermonEditorView
          ref={sermonEditorViewRef}
          sermon={sermon}
          onChange={setEditorState}
        />
      </Modal>
    );
  },
);

export { EditSermonModal };
