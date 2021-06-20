import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import { Provider } from 'react-redux';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import store from './src/redux/store';
import AppNavigator from './src/routes/RootNavigator';

import 'moment/locale/uk';

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
  ) : (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
