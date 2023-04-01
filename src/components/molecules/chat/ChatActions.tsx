import { ActionsProps, Actions as GCActions } from 'react-native-gifted-chat';
import { CameraModal, MediaCapture } from '@react-native-ajp-elements/ui';
import React, { useRef } from 'react';

import { Asset } from 'react-native-image-picker';
import { Icon } from '@rneui/base';
import { Keyboard } from 'react-native';
import { useTheme } from 'theme';

export const renderActions = (props: ActionsProps) => {
  return <Actions {...props} />;
};

export const Actions = (props: ActionsProps) => {
  const theme = useTheme();

  const cameraModalRef = useRef<CameraModal>(null);

  const onCapture = (capture: MediaCapture) => {
    console.log('send this file', capture.media.path);
  };

  const onSelect = (assets: Asset[]) => {
    console.log('send these files', assets.length, assets[0].uri);
  };

  const renderCameraIcon = () => {
    return (
      <Icon
        name="camera"
        type={'material-community'}
        color={theme.colors.icon}
        size={24}
      />
    );
  };

  return (
    <>
      <GCActions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
        }}
        icon={renderCameraIcon}
        onPressActionButton={() => {
          Keyboard.dismiss();
          cameraModalRef.current?.present();
        }}
      />
      <CameraModal
        ref={cameraModalRef}
        preview={true}
        onCapture={onCapture}
        onSelect={onSelect}
      />
    </>
  );
};
