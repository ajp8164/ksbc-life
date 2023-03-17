import { EditUserModalMethods, EditUserModalProps } from './types';
import React, { useImperativeHandle, useRef, useState } from 'react';
import UserEditorView, {
  EditorState,
} from 'components/admin/views/UserEditorView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';
import { UserProfile } from 'types/user';

type EditUserModal = EditUserModalMethods;

const EditUserModal = React.forwardRef<EditUserModal, EditUserModalProps>(
  (_props, ref) => {
    const innerRef = useRef<BottomSheetModalMethods>(null);
    const userEditorViewRef = useRef<UserEditorView>(null);

    const [editorState, setEditorState] = useState({} as EditorState);
    const [user, setUser] = useState<UserProfile>();
    const [title, setTitle] = useState('');

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = (title: string, user: UserProfile) => {
      setTitle(title);
      setUser(user);
      innerRef.current?.present();
    };

    return (
      <Modal ref={innerRef}>
        <ModalHeader
          title={title}
          rightButtonText={'Save'}
          rightButtonDisabled={!editorState.changed}
          onRightButtonPress={() => {
            userEditorViewRef.current
              ?.saveUser()
              .then(dismiss)
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .catch(() => {});
          }}
        />
        <UserEditorView
          ref={userEditorViewRef}
          user={user}
          onChange={setEditorState}
        />
      </Modal>
    );
  },
);

export { EditUserModal };
