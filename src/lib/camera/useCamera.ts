import { CameraContext } from './useCameraContext';
import { useContext } from 'react';

export const useCamera = (): CameraContext => {
  return useContext(CameraContext);
};
