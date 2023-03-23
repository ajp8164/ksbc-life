import {
  EditScreenContentItemModalMethods,
  EditScreenContentItemModalProps,
} from './types';
import ScreenContentItemEditorView, {
  EditorState,
} from 'components/admin/views/ScreenContentItemEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { ScreenContentItem } from 'types/screenContentItem';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';

type EditScreenContentItemModal = EditScreenContentItemModalMethods;

const EditScreenContentItemModal = React.forwardRef<
  EditScreenContentItemModal,
  EditScreenContentItemModalProps
>((_props, ref) => {
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const ScreenContentItemEditorViewRef =
    useRef<ScreenContentItemEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [screenContentItem, setScreenContentItem] =
    useState<ScreenContentItem>();
  const [title, setTitle] = useState('');

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string, screenContent?: ScreenContentItem) => {
    setTitle(title);
    setScreenContentItem(screenContent);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          ScreenContentItemEditorViewRef.current
            ?.saveScreenContentItem()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <ScreenContentItemEditorView
        ref={ScreenContentItemEditorViewRef}
        screenContentItem={screenContentItem}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditScreenContentItemModal };
