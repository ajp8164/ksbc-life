import ChurchEditorView, {
  EditorState,
} from 'components/admin/views/ChurchEditorView';
import { EditChurchModalMethods, EditChurchModalProps } from './types';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Church } from 'types/church';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';

type EditChurchModal = EditChurchModalMethods;

const EditChurchModal = React.forwardRef<EditChurchModal, EditChurchModalProps>(
  (_props, ref) => {
    const innerRef = useRef<BottomSheetModalMethods>(null);
    const churchEditorViewRef = useRef<ChurchEditorView>(null);

    const [editorState, setEditorState] = useState({} as EditorState);
    const [church, setChurch] = useState<Church>();

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = (church: Church) => {
      setChurch(church);
      innerRef.current?.present();
    };

    return (
      <Modal ref={innerRef}>
        <ModalHeader
          title={'Edit Church'}
          rightButtonText={'Save'}
          rightButtonDisabled={!editorState.changed}
          onRightButtonPress={() =>
            churchEditorViewRef.current
              ?.saveChurch()
              .then(dismiss)
              .catch(() => {
                // Nothing to do. Prevent unhandled promise.
              })
          }
        />
        <ChurchEditorView
          ref={churchEditorViewRef}
          church={church}
          onChange={setEditorState}
        />
      </Modal>
    );
  },
);

export { EditChurchModal };
