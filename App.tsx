import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import AppNavigator from './src/routes/AppNavigator';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const cacheImages = (images: string[]) => {
    return images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
  }

  const _cacheResourcesAsync = async () => {
    const images = [require('./assets/logo.png')];
    const cachedImages = cacheImages(images);
    await Promise.all(cachedImages);
  }

  return !appIsReady ? (
    <AppLoading
      startAsync={_cacheResourcesAsync}
      onFinish={() => setAppIsReady(true)}
      onError={console.warn}
    />
  ) : <AppNavigator />;
};

export default App;
