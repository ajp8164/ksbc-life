import { NewSermonModalMethods, NewSermonModalProps } from './types';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import NewSermonView from 'components/admin/views/NewSermonView';

type NewSermonModal = NewSermonModalMethods;

const NewSermonModal = React.forwardRef<NewSermonModal, NewSermonModalProps>(
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
        <NewSermonView />
      </Modal>
    );
  },
);

export { NewSermonModal };
