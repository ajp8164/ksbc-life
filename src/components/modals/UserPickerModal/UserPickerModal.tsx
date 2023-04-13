import { Modal, ModalHeader } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef } from 'react';
import { UserPickerModalMethods, UserPickerModalProps } from './types';
import UsersView, { UsersViewMethods } from 'components/views/UsersView';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { UserProfile } from 'types/user';

type UserPickerModal = UserPickerModalMethods;

const UserPickerModal = React.forwardRef<UserPickerModal, UserPickerModalProps>(
  (props, ref) => {
    const {
      headerTitle,
      multiple,
      onDeselect,
      onSelect,
      selected,
      snapPoints = ['92%'],
      userProfiles,
    } = props;

    const innerRef = useRef<BottomSheetModalMethods>(null);
    const usersViewRef = useRef<UsersViewMethods>(null);

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

    const onUserSelect = (userProfile: UserProfile) => {
      onSelect(userProfile);
      if (!multiple) {
        dismiss();
      }
    };

    return (
      <Modal
        ref={innerRef}
        snapPoints={snapPoints}
        scrollEnabled={false}
        onDismiss={dismiss}>
        {headerTitle && (
          <ModalHeader
            title={headerTitle}
            rightButtonIcon={'close'}
            size={'small'}
            onRightButtonPress={dismiss}
          />
        )}
        <UsersView
          ref={usersViewRef}
          onDeselect={onDeselect}
          onSelect={onUserSelect}
          selected={selected}
          userProfiles={userProfiles}
        />
      </Modal>
    );
  },
);

export { UserPickerModal };
