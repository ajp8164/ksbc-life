import { AddSermonModalMethods, AddSermonModalProps } from './types';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import SermonEditorView from 'components/admin/views/SermonEditorView';

type AddSermonModal = AddSermonModalMethods;

const AddSermonModal = React.forwardRef<AddSermonModal, AddSermonModalProps>(
  (_props, ref) => {
    const innerRef = useRef<BottomSheetModalMethods>(null);

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
      <Modal ref={innerRef}>
        <SermonEditorView />
      </Modal>
    );
  },
);

export { AddSermonModal };
