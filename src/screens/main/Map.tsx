import React from 'react';
import { View, StyleSheet, StatusBar, Image, Text } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Svg } from 'react-native-svg';
import WebView from 'react-native-webview';

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
        provider={PROVIDER_GOOGLE}
        style={styles.flex}
      >
        <Marker
          coordinate={{
            latitude: 37,
            longitude: -122,
          }}
        >
          <Callout>
            <View>
              <WebView style={{ height: 100 , width: 100, }} source={{ uri: 'https://picsum.photos/400/400?random=1' }} />
            </View>
          </Callout>
        </Marker>
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
