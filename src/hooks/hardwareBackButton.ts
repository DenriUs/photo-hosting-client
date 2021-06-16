import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useHardwareBackButton = (handler: () => boolean | null | undefined) => {
  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => unsubscribe.remove();
  });
}

export default useHardwareBackButton;
