import {
  EditPageContentItemModalMethods,
  EditPageContentItemModalProps,
} from './types';
import { Modal, viewport } from '@react-native-ajp-elements/ui';
import PageContentItemEditorView, {
  EditorState,
} from 'components/admin/views/PageContentItemEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ModalHeader from 'components/molecules/ModalHeader';
import { PageContentItem } from 'types/pageContentItem';
import { useTheme } from 'theme';

type EditPageContentItemModal = EditPageContentItemModalMethods;

const EditPageContentItemModal = React.forwardRef<
  EditPageContentItemModal,
  EditPageContentItemModalProps
>((_props, ref) => {
  const theme = useTheme();

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const PageContentItemEditorViewRef = useRef<PageContentItemEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [pageContentItem, setPageContentItem] = useState<PageContentItem>();
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

  const present = (title: string, pageContent?: PageContentItem) => {
    setTitle(title);
    setPageContentItem(pageContent);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef} enableGestureBehavior={false}>
      <ModalHeader
        size={'small'}
        title={title}
        leftButtonText={'Cancel'}
        leftButtonDisabled={editorState.isSubmitting}
        onLeftButtonPress={dismiss}
        rightButtonText={'Save'}
        rightButtonBusy={editorState.isSubmitting}
        rightButtonDisabled={!editorState.changed}
        onRightButtonPress={() =>
          PageContentItemEditorViewRef.current
            ?.savePageContentItem()
            .then(dismiss)
            .catch(() => {
              // Nothing to do. Prevent unhandled promise.
            })
        }
      />
      <PageContentItemEditorView
        ref={PageContentItemEditorViewRef}
        contentContainerHeight={contentContainerHeight}
        pageContentItem={pageContentItem}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditPageContentItemModal };
