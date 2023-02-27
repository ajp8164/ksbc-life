import { SignInModalMethods, SignInModalProps } from './types';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import SignInView from '../../views/SignInView';
import { Modal } from '@react-native-ajp-elements/ui';

type SignInModal = SignInModalMethods;

const SignInModal = React.forwardRef<SignInModal, SignInModalProps>(
  (props, ref) => {
    const { onAuthStateChanged } = props;
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
        <SignInView onAuthStateChanged={onAuthStateChanged} />
      </Modal>
    );
  },
);

export { SignInModal };
