import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import MapView from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Map = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.3)');
      StatusBar.setBarStyle('light-content');
    }, [])
  )

  return (
    <View style={styles.flex}>
      <StatusBar translucent />
      <MapView
        style={styles.flex}
      >  
      </MapView>
    </View>
  )
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Map;
