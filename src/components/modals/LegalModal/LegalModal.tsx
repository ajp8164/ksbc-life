import { LegalModalMethods, LegalModalProps } from './types';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import LegalView from '../../views/LegalView';
import { Modal } from '@react-native-ajp-elements/ui';

type LegalModal = LegalModalMethods;

const LegalModal = React.forwardRef<LegalModal, LegalModalProps>(
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
      <Modal ref={innerRef} background={'inverse'}>
        <LegalView />
      </Modal>
    );
  },
);

export { LegalModal };
