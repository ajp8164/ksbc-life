import { EditGroupModalMethods, EditGroupModalProps } from './types';
import GroupEditorView, {
  EditorState,
  GroupEditorViewMethods,
} from 'components/views/GroupEditorView';
import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type EditGroupModal = EditGroupModalMethods;

const EditGroupModal = React.forwardRef<EditGroupModal, EditGroupModalProps>(
  (props, ref) => {
    const { group, snapPoints = ['92%'] } = props;

    const innerRef = useRef<BottomSheetModalMethods>(null);
    const groupEditorViewRef = useRef<GroupEditorViewMethods>(null);

    const [editorState, setEditorState] = useState({} as EditorState);

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = () => {
      innerRef.current?.present();
    };

    return (
      <Modal ref={innerRef} snapPoints={snapPoints}>
        <ModalHeader
          title={'Edit Group'}
          rightButtonText={'Save'}
          rightButtonDisabled={!editorState.changed}
          onRightButtonPress={() =>
            groupEditorViewRef.current
              ?.saveGroup()
              .then(dismiss)
              .catch(() => {
                // Nothing to do. Prevent unhandled promise.
              })
          }
        />
        <GroupEditorView
          ref={groupEditorViewRef}
          group={group}
          onEditorStateChange={setEditorState}
        />
      </Modal>
    );
  },
);

export { EditGroupModal };
