import React, { useImperativeHandle, useRef } from 'react';
import { TextModalMethods, TextModalProps } from './types';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import TextView from 'components/views/TextView';

type TextModal = TextModalMethods;

const TextModal = React.forwardRef<TextModal, TextModalProps>((props, ref) => {
  const { placeholder } = props;

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
    <Modal ref={innerRef} snapPoints={['92%']}>
      <TextView placeholder={placeholder} viewableHeightPercentage={0.92} />
    </Modal>
  );
});

export { TextModal };
