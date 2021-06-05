import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <View style={[styles.flex, styles.loadingContainer]}>
      <LottieView
        source={require('../../../assets/lottie/loading.json')}
        autoPlay
        loop
      />
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />
      <Text>Main Screen</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default Main;
