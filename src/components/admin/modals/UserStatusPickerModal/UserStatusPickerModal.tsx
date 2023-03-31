import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  UserStatusPickerModalMethods,
  UserStatusPickerModalProps,
} from './types';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { UserStatus } from 'types/user';
import UserStatusPickerView from './UserStatusPickerView';

type UserStatusPickerModal = UserStatusPickerModalMethods;

const UserStatusPickerModal = React.forwardRef<
  UserStatusPickerModal,
  UserStatusPickerModalProps
>((props, ref) => {
  const { disabled, onDismiss, value } = props;
  const innerRef = useRef<BottomSheetModalMethods>(null);

  const [userStatus, setUserStatus] = useState<UserStatus>(value);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = (userStatus?: UserStatus) => {
    userStatus && setUserStatus(userStatus);
    innerRef.current?.dismiss();
  };

  const present = () => {
    innerRef.current?.present();
  };

  return (
    <Modal
      ref={innerRef}
      snapPoints={[350]}
      onDismiss={() => onDismiss(userStatus)}>
      <ModalHeader
        title={'Select User Status'}
        size={'small'}
        rightButtonIcon={'close'}
        onRightButtonPress={() => dismiss(userStatus)}
      />
      <UserStatusPickerView
        value={userStatus}
        disabled={disabled}
        onChange={setUserStatus}
      />
    </Modal>
  );
});

export { UserStatusPickerModal };
