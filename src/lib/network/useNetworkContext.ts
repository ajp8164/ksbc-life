import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { createContext, useEffect, useState } from 'react';

export type NetworkContext = {
  state: NetInfoState | undefined;
};

export const NetworkContext = createContext<NetworkContext>({
  state: undefined,
});

export const useNetworkContext = (): NetworkContext => {
  const [state, setState] = useState<NetInfoState>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(changedState => {
      setState(changedState);
    });

    return unsubscribe;
  }, []);

  return {
    state,
  };
};
