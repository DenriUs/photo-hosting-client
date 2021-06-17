import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';

const LoadingScreen = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content');
  });

  return (
    <View style={style.loadingContainer}>
      <LottieView
        autoPlay
        loop
        source={require('../../../assets/lottie/loading.json')}
      />
    </View>
  );
};

const style = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default LoadingScreen;
