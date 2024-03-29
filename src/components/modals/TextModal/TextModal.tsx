import { LayoutChangeEvent, Platform, StatusBar } from 'react-native';
import { Modal, ModalHeader, viewport } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { TextModalMethods, TextModalProps } from './types';
import TextView, { TextViewMethods } from 'components/views/TextView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TextModal = TextModalMethods;

const TextModal = React.forwardRef<TextModal, TextModalProps>((props, ref) => {
  const {
    characterLimit,
    headerTitle,
    onDismiss,
    placeholder,
    snapPoints = ['92%'],
    textContainerStyle,
    value,
  } = props;

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const textViewRef = useRef<TextViewMethods>(null);

  const text = useRef('');
  const [modalHeaderHeight, setModalHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const textHeight =
    viewport.height * 0.92 -
    modalHeaderHeight -
    insets.top -
    insets.bottom -
    (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);

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

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setModalHeaderHeight(height);
  };

  return (
    <Modal
      ref={innerRef}
      snapPoints={snapPoints}
      onDismiss={() => onDismiss(text.current)}>
      {headerTitle && (
        <ModalHeader
          title={headerTitle}
          rightButtonIcon={'close'}
          size={'small'}
          onRightButtonPress={dismiss}
          onLayout={onHeaderLayout}
        />
      )}
      <TextView
        ref={textViewRef}
        placeholder={placeholder}
        characterLimit={characterLimit}
        textHeight={textHeight}
        containerStyle={textContainerStyle}
        value={value}
        onTextChanged={(t: string) => {
          text.current = t;
        }}
      />
    </Modal>
  );
});

export { TextModal };
