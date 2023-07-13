import { GroupModalMethods, GroupModalProps } from './types';
import GroupView, {
  EditorState,
  GroupViewMethods,
} from 'components/views/GroupView';
import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type GroupModal = GroupModalMethods;

const GroupModal = React.forwardRef<GroupModal, GroupModalProps>(
  (props, ref) => {
    const { group, snapPoints = ['92%'] } = props;

    const innerRef = useRef<BottomSheetModalMethods>(null);
    const groupViewRef = useRef<GroupViewMethods>(null);

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
          size={'small'}
          rightButtonText={'Done'}
          rightButtonBusy={editorState.isSubmitting}
          onRightButtonPress={dismiss}
        />
        <GroupView
          ref={groupViewRef}
          group={group}
          onEditorStateChange={setEditorState}
        />
      </Modal>
    );
  },
);

export { GroupModal };
