import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef } from 'react';
import {
  SermonVideoPickerModalMethods,
  SermonVideoPickerModalProps,
} from './types';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { SermonVideo } from 'types/sermon';
import SermonVideoPickerView from './SermonVideoPickerView';

type SermonVideoPickerModal = SermonVideoPickerModalMethods;

const SermonVideoPickerModal = React.forwardRef<
  SermonVideoPickerModal,
  SermonVideoPickerModalProps
>((props, ref) => {
  const { onChange, value } = props;
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

  const onVideoChange = (video: SermonVideo) => {
    onChange(video);
    dismiss();
  };

  return (
    <Modal ref={innerRef} snapPoints={[350, '92%']} scrollEnabled={false}>
      <ModalHeader
        title={'Select Video'}
        size={'small'}
        rightButtonIcon={'close'}
        onRightButtonPress={dismiss}
      />
      <SermonVideoPickerView value={value} onChange={onVideoChange} />
    </Modal>
  );
});

export { SermonVideoPickerModal };
