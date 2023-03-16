import { EditSermonModalMethods, EditSermonModalProps } from './types';
import React, { useImperativeHandle, useRef, useState } from 'react';
import SermonEditorView, {
  EditorState,
} from 'components/admin/views/SermonEditorView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';
import { Sermon } from 'types/church';

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

    const present = (title: string, sermon: Sermon) => {
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
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .catch(() => {});
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
