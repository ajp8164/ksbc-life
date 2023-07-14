import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { UserProfileModalMethods, UserProfileModalProps } from './types';
import UserProfileView, {
  EditorState,
  UserProfileViewMethods,
} from 'components/views/UserProfileView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { UserProfile } from 'types/user';

type UserProfileModal = UserProfileModalMethods;

const UserProfileModal = React.forwardRef<
  UserProfileModal,
  UserProfileModalProps
>((props, ref) => {
  const { userProfile, snapPoints = ['92%'] } = props;

  const innerRef = useRef<BottomSheetModalMethods>(null);
  const userProfileViewRef = useRef<UserProfileViewMethods>(null);

  const [editorState, setEditorState] = useState({} as EditorState);
  const [userProfileOnPresent, setUserProfileOnPresent] =
    useState<UserProfile>();

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = () => {
    innerRef.current?.dismiss();
  };

  const present = (userProfile?: UserProfile) => {
    setUserProfileOnPresent(userProfile);
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef} snapPoints={snapPoints}>
      <ModalHeader
        size={'small'}
        rightButtonText={'Done'}
        rightButtonBusy={editorState.isSubmitting}
        onRightButtonPress={dismiss}
      />
      <UserProfileView
        ref={userProfileViewRef}
        userProfile={userProfile || userProfileOnPresent}
        onEditorStateChange={setEditorState}
        style={'modal'}
      />
    </Modal>
  );
});

export { UserProfileModal };
