import {
  EditScreenContentItemModalMethods,
  EditScreenContentItemModalProps,
} from './types';
import { Modal, viewport } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';
import ScreenContentItemEditorView, {
  EditorState,
} from 'components/admin/views/ScreenContentItemEditorView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ModalHeader from 'components/molecules/ModalHeader';
import { ScreenContentItem } from 'types/screenContentItem';
import { useTheme } from 'theme';

type EditScreenContentItemModal = EditScreenContentItemModalMethods;

const EditScreenContentItemModal = React.forwardRef<
  EditScreenContentItemModal,
  EditScreenContentItemModalProps
>((_props, ref) => {
  const theme = useTheme();

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const ScreenContentItemEditorViewRef =
    useRef<ScreenContentItemEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [screenContentItem, setScreenContentItem] =
    useState<ScreenContentItem>();
  const [title, setTitle] = useState('');

  const contentContainerHeight =
    Math.ceil(viewport.height * 0.921) -
    (theme.styles.modalHeader.height as number) -
    (theme.styles.bottomSheetHandle.height as number);

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
        contentContainerHeight={contentContainerHeight}
        screenContentItem={screenContentItem}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditScreenContentItemModal };
