import {
  EditPageContentItemModalMethods,
  EditPageContentItemModalProps,
} from './types';
import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import PageContentItemEditorView, {
  EditorState,
} from 'components/admin/views/PageContentItemEditorView';
import React, { useImperativeHandle, useRef, useState } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { PageContentItem } from 'types/pageContentItem';

type EditPageContentItemModal = EditPageContentItemModalMethods;

const EditPageContentItemModal = React.forwardRef<
  EditPageContentItemModal,
  EditPageContentItemModalProps
>((_props, ref) => {
  const innerRef = useRef<BottomSheetModalMethods>(null);
  const PageContentItemEditorViewRef = useRef<PageContentItemEditorView>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [pageContentItem, setPageContentItem] = useState<PageContentItem>();
  const [title, setTitle] = useState('');

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
        pageContentItem={pageContentItem}
        onChange={setEditorState}
      />
    </Modal>
  );
});

export { EditPageContentItemModal };
