import {
  EditScreenContentItemModalMethods,
  EditScreenContentItemModalProps,
  EditorState,
} from './types';
import { Modal, viewport } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ModalHeader from 'components/molecules/ModalHeader';
import { ScreenContentItem } from 'types/screenContentItem';
import ScreenContentItemEditorView from 'components/admin/views/ScreenContentItemEditorView';
import { useTheme } from 'theme';

type EditScreenContentItemModal = EditScreenContentItemModalMethods;

const EditScreenContentItemModal = React.forwardRef<
  EditScreenContentItemModal,
  EditScreenContentItemModalProps
>((_props, ref) => {
  const theme = useTheme();

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const screenContentItemEditorViewRef =
    useRef<ScreenContentItemEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [screenContentItem, setScreenContentItem] =
    useState<ScreenContentItem>();
  const [title, setTitle] = useState('');

  const contentContainerHeight =
    Math.ceil(viewport.height * 0.921) -
    Number(theme.styles.modalHeader.height) +
    Number(theme.styles.bottomSheetHandle.height);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (title: string, screenContentItem?: ScreenContentItem) => {
    setTitle(title);
    setScreenContentItem(screenContentItem);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef} scrollEnabled={false}>
      <ModalHeader
        title={title}
        rightButtonText={'Save'}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          screenContentItemEditorViewRef.current
            ?.saveScreenContentItem()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <ScreenContentItemEditorView
        ref={screenContentItemEditorViewRef}
        contentContainerStyle={{ height: contentContainerHeight }}
        screenContentItem={screenContentItem}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditScreenContentItemModal };
