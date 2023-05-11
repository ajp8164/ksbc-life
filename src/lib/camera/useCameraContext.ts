import {
  CameraModalMethods,
  PresentInterface,
} from '@react-native-ajp-elements/ui';

import { createContext } from 'react';

export type CameraContext = {
  dismissCameraModal: () => void;
  presentCameraModal: (args: PresentInterface) => void;
};

export const CameraContext = createContext<CameraContext>({
  dismissCameraModal: () => {
    return;
  },
  presentCameraModal: () => {
    return;
  },
});

export const useCameraContext = (
  cameraModalRef: React.RefObject<CameraModalMethods>,
): CameraContext => {
  const dismiss = () => {
    cameraModalRef.current?.dismiss();
  };

  const present = (args: PresentInterface) => {
    cameraModalRef.current?.present(args);
  };

  return {
    dismissCameraModal: dismiss,
    presentCameraModal: present,
  };
};
