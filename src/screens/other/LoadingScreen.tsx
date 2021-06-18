import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen = () => (
  <View style={style.loadingContainer}>
    <StatusBar translucent backgroundColor='#ffffff' barStyle='dark-content' />
    <LottieView
      autoPlay
      loop
      source={require('../../../assets/lottie/loading.json')}
    />
  </View>
);

const style = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default LoadingScreen;
