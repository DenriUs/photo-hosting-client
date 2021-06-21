import React, { useCallback } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import MapView, { Callout, MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Appbar, Button } from 'react-native-paper';
import {
  closeLocationPickerMap,
  setLocationPickerMapMarker,
  toggleLocationPickerMapAutoClosing,
} from '../../redux/slices/mapSlice';
import { updatePhoto } from '../../api/requests/photo';
import { Svg, Image as ImageSVG } from 'react-native-svg';
import { useEffect } from 'react';

const LocationPickerMap = () => {
  const navigation = useNavigation();

  const currentViwedPhotoId = useAppSelector(
    (state) => state.photoCarousel.currentlyViewedPhoto?._id
  );
  const currentViwedPhotoUrl = useAppSelector(
    (state) => state.photoCarousel.currentlyViewedPhoto?.hostUrl
  );
  const locationPickerMapState = useAppSelector((state) => state.map.locationPickerMapState);
  const dispatch = useAppDispatch();

  const onHeaderBackActionPress = () => {
    navigation.goBack();
  };

  const onMapViewPress = (event: MapEvent<{}>) => {
    dispatch(setLocationPickerMapMarker(event.nativeEvent.coordinate));
  };

  const onMarkerPress = () => dispatch(setLocationPickerMapMarker(null));

  const onSaveLatLngPress = () => {
    if (
      !currentViwedPhotoId ||
      !locationPickerMapState.markerLatLng?.latitude ||
      !locationPickerMapState.markerLatLng?.longitude
    ) {
      return;
    }
    dispatch(
      updatePhoto({
        id: currentViwedPhotoId,
        latitude: locationPickerMapState.markerLatLng.latitude,
        longitude: locationPickerMapState.markerLatLng.longitude,
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => dispatch(closeLocationPickerMap());
    }, [])
  );

  useEffect(() => {
    if (locationPickerMapState.autoClose) {
      dispatch(toggleLocationPickerMapAutoClosing(false));
      navigation.navigate('MainNavigator', { screen: 'MapWindow' });
    }
  }, [locationPickerMapState.autoClose]);

  return (
    <View style={styles.flex}>
      <StatusBar translucent />
      <View style={styles.headerWrapper}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction color="#ffffff" onPress={onHeaderBackActionPress} />
          <Appbar.Content
            title={locationPickerMapState.mode === 'NEW' ? 'Виберіть місце зйомки' : ''}
            color="#ffffff"
          />
        </Appbar.Header>
      </View>
      <View style={styles.linearGradientView} />
      <MapView
        rotateEnabled={false}
        provider={PROVIDER_GOOGLE}
        style={styles.flex}
        {...(locationPickerMapState.mode === 'NEW' && { onPress: onMapViewPress })}>
        {locationPickerMapState.markerLatLng && (
          <Marker
            coordinate={locationPickerMapState.markerLatLng}
            {...(locationPickerMapState.mode === 'NEW' && { onPress: onMarkerPress })}>
            {locationPickerMapState.mode === 'VIEW' && (
              <Callout>
                <Svg style={styles.imageWrapper}>
                  <ImageSVG
                    width={'100%'}
                    height={'100%'}
                    preserveAspectRatio="xMidYMid slice"
                    href={{ uri: currentViwedPhotoUrl }}
                  />
                </Svg>
              </Callout>
            )}
          </Marker>
        )}
      </MapView>
      {locationPickerMapState.mode === 'NEW' && locationPickerMapState.markerLatLng && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Button
            mode="contained"
            uppercase={false}
            color="#ffffff"
            loading={locationPickerMapState.loading}
            disabled={locationPickerMapState.loading}
            contentStyle={{ height: 50 }}
            style={{ width: '100%' }}
            onPress={onSaveLatLngPress}>
            <Text style={{ color: '#3a2c3a', letterSpacing: 0.5 }}>Зберегти</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },
  header: {
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  linearGradientView: {
    position: 'absolute',
    width: '100%',
    height: 100,
    top: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default LocationPickerMap;
