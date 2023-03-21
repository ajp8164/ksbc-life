import React, { useImperativeHandle, useRef, useState } from 'react';
import { UserRolePickerModalMethods, UserRolePickerModalProps } from './types';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import ModalHeader from 'components/molecules/ModalHeader';
import { UserRole } from 'types/user';
import UserRolePickerView from './UserRolePickerView';

type UserRolePickerModal = UserRolePickerModalMethods;

const UserRolePickerModal = React.forwardRef<
  UserRolePickerModal,
  UserRolePickerModalProps
>((props, ref) => {
  const { disabled, onDismiss, value } = props;
  const innerRef = useRef<BottomSheetModalMethods>(null);

  const [userRole, setUserRole] = useState<UserRole>(value);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = (userRole?: UserRole) => {
    userRole && setUserRole(userRole);
    innerRef.current?.dismiss();
  };

  const present = () => {
    innerRef.current?.present();
  };

  return (
    <Modal
      ref={innerRef}
      snapPoints={[350]}
      onDismiss={() => onDismiss(userRole)}>
      <ModalHeader
        title={'Select User Role'}
        size={'small'}
        rightButtonIcon={'close'}
        onRightButtonPress={() => dismiss(userRole)}
      />
      <UserRolePickerView
        value={userRole}
        disabled={disabled}
        onChange={setUserRole}
      />
    </Modal>
  );
});

export { UserRolePickerModal };
