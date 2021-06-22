import React, { RefObject, useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import MapView, { Callout, Marker, Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Svg, Image as ImageSVG } from 'react-native-svg';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { RadioButton, IconButton, Title, Divider } from 'react-native-paper';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getAccessedPhotos, getFavoritePhotos, getOwnPhotos } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';
import { changeCarouselMode, changeCurrentlyViwedPhoto, loadPhotos, openPhotoCarousel } from '../../redux/slices/photoCarouselSlice';
import {
  changeMapMode,
  changePhotosType,
  loadMarkers,
  toggleMapFocused,
  toggleMapOptions,
} from '../../redux/slices/mapSlice';
import { Photo } from '../../api/entities';
import { PhotosType } from '../../redux/types';

const MapWindow = () => {
  const [markerRefs, setMarkerRefs] = useState<RefObject<Marker>[]>([]);

  const { width, height } = useSafeAreaFrame();

  const navigation = useNavigation();

  const mapState = useAppSelector((state) => state.map);

  const ownPhotos = useAppSelector((state) => state.photo.ownPhotos);
  const favoritePhotos = useAppSelector((state) => state.photo.favoritesPhotos);
  const accessPhotos = useAppSelector((state) => state.photo.accessedPhotos);

  const photoUploading = useAppSelector((state) => state.photo.uploading);

  const isCarouselOpened = useAppSelector((state) => state.photoCarousel.isCarouselOpened);
  const carouselMode = useAppSelector((state) => state.photoCarousel.carouselMode);
  const dispatch = useAppDispatch();

  const heatPoints = mapState.photoMarkers.map((photo) => ({
    longitude: photo.longitude,
    latitude: photo.latitude,
  }));

  const photosTypeToLoad = new Map<PhotosType, Photo[]>();
  photosTypeToLoad.set('OWN', ownPhotos);
  photosTypeToLoad.set('FAVORITE', favoritePhotos);
  photosTypeToLoad.set('ACCESS', accessPhotos);

  const onMarkerPress = (markerIndex: number) => {
    setTimeout(() => {
      markerRefs[markerIndex]?.current?.hideCallout();
      markerRefs[markerIndex]?.current?.showCallout();
    }, 200);
  };

  const onCalloutPress = (markerIndex: number) => {
    dispatch(loadPhotos(mapState.photoMarkers));
    dispatch(changeCurrentlyViwedPhoto(mapState.photoMarkers[markerIndex]));
    dispatch(openPhotoCarousel(markerIndex));
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(toggleMapFocused(true));
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.3)');
      StatusBar.setBarStyle('light-content');
      return () => dispatch(toggleMapFocused(false));
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      let photosToFilter: Photo[] = photosTypeToLoad.get(mapState.photosType) || [];
      if (photosToFilter.length === 0) {
        if (mapState.photosType === 'FAVORITE') {
          dispatch(getFavoritePhotos());
        } else if (mapState.photosType === 'ACCESS') {
          dispatch(getAccessedPhotos());
        }
      }
      const markers = photosToFilter.filter((photo) => photo.longitude && photo.latitude);
      dispatch(loadMarkers(markers));
    }, [ownPhotos, favoritePhotos, accessPhotos, mapState.photosType])
  );

  useEffect(() => {
    setMarkerRefs((markerRefs) =>
      Array(mapState.photoMarkers.length)
        .fill(0)
        .map((_, i) => markerRefs[i] || React.createRef())
    );
  }, [mapState.photoMarkers.length]);

  useEffect(() => {
    if (isCarouselOpened) {
      navigation.navigate('PhotoCarousel');
    }
  }, [isCarouselOpened]);

  useEffect(() => {
    dispatch(changeCarouselMode(mapState.photosType));
  }, [mapState.photosType])

  useEffect(() => {
    if (ownPhotos.length === 0) {
      dispatch(getOwnPhotos());
    }
  }, []);

  const renderedMarkers = mapState.photoMarkers.map((photo, index) => (
    <Marker
      key={photo._id}
      ref={markerRefs[index]}
      coordinate={{
        latitude: photo.latitude,
        longitude: photo.longitude,
      }}
      onPress={() => onMarkerPress(index)}>
      <Callout onPress={() => onCalloutPress(index)}>
        <Svg style={styles.imageWrapper}>
          <ImageSVG
            width={'100%'}
            height={'100%'}
            preserveAspectRatio="xMidYMid slice"
            href={{ uri: photo.hostUrl }}
          />
        </Svg>
      </Callout>
    </Marker>
  ));

  return (photoUploading || mapState.loading) && mapState.isFocused ? (
    <LoadingScreen />
  ) : (
    <View style={styles.flex}>
      <StatusBar translucent />
      <MapView rotateEnabled={false} provider={PROVIDER_GOOGLE} style={styles.flex}>
        {mapState.mode === 'MARKER'
          ? renderedMarkers
          : heatPoints.length !== 0 && (
              <Heatmap points={heatPoints} radius={40} opacity={1}></Heatmap>
            )}
      </MapView>
      <View style={[StyleSheet.absoluteFill, { marginTop: Constants.statusBarHeight }]}>
        <IconButton
          icon="cog"
          style={{ backgroundColor: '#ffffff' }}
          size={25}
          onPress={() => dispatch(toggleMapOptions(true))}
        />
        <Modal
          isVisible={mapState.isOptionsOpened}
          animationIn="fadeInUpBig"
          animationOut="fadeOut"
          statusBarTranslucent
          backdropTransitionOutTiming={0}
          onBackdropPress={() => dispatch(toggleMapOptions(false))}>
          <View
            style={{
              width: '100%',
              height: '40%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: '#ffffff',
            }}>
            <View
              style={{
                height: '50%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Title style={{ marginTop: 30 }}>Режим відображення:</Title>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Маркер</Text>
                  <RadioButton
                    value="marker"
                    status={mapState.mode === 'MARKER' ? 'checked' : 'unchecked'}
                    color="#f7623c"
                    onPress={() => dispatch(changeMapMode('MARKER'))}
                  />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Теплова мітка</Text>
                  <RadioButton
                    value="heatPoint"
                    status={mapState.mode === 'HEAT' ? 'checked' : 'unchecked'}
                    color="#f7623c"
                    onPress={() => dispatch(changeMapMode('HEAT'))}
                  />
                </View>
              </View>
            </View>
            <Divider style={{ width: '100%' }} />
            <View
              style={{
                height: '50%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Title style={{ marginTop: 30 }}>Фільтр фото:</Title>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 20,
                }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Власні</Text>
                  <RadioButton
                    value="own"
                    status={mapState.photosType === 'OWN' ? 'checked' : 'unchecked'}
                    color="#f7623c"
                    onPress={() => dispatch(changePhotosType('OWN'))}
                  />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Обрані</Text>
                  <RadioButton
                    value="favorite"
                    status={mapState.photosType === 'FAVORITE' ? 'checked' : 'unchecked'}
                    color="#f7623c"
                    onPress={() => dispatch(changePhotosType('FAVORITE'))}
                  />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold' }}>Доступні</Text>
                  <RadioButton
                    value="accessed"
                    status={mapState.photosType === 'ACCESS' ? 'checked' : 'unchecked'}
                    color="#f7623c"
                    onPress={() => dispatch(changePhotosType('ACCESS'))}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default MapWindow;
