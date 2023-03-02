import React, { useImperativeHandle, useRef } from 'react';
import { TextModalMethods, TextModalProps } from './types';
import TextView, { TextViewMethods } from 'components/views/TextView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';

type TextModal = TextModalMethods;

const TextModal = React.forwardRef<TextModal, TextModalProps>((props, ref) => {
  const { onDismiss, placeholder } = props;

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const textViewRef = useRef<TextViewMethods>(null);

  const text = useRef('');

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
    <Modal
      ref={innerRef}
      snapPoints={['92%']}
      onDismiss={() => onDismiss(text.current)}>
      <TextView
        ref={textViewRef}
        placeholder={placeholder}
        viewableHeightPercentage={0.92}
        onTextChanged={(t: string) => {
          text.current = t;
        }}
      />
    </Modal>
  );
});

export { TextModal };
