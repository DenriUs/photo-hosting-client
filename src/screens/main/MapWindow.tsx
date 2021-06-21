import React, { RefObject, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Svg, Image as ImageSVG } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getOwnPhotos } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';
import { loadPhotos, openPhotoCarousel } from '../../redux/slices/photoCarouselSlice';
import { loadMarkers, toggleMapFocused } from '../../redux/slices/mapSlice';
import { Photo } from '../../api/entities';
import { PhotosType } from '../../redux/types';

const MapWindow = () => {
  const [markerRefs, setMarkerRefs] = useState<RefObject<Marker>[]>([]);

  const navigation = useNavigation();

  const mapState = useAppSelector((state) => state.map);

  const ownPhotos = useAppSelector((state) => state.photo.ownPhotos);
  const favoritePhotos = useAppSelector((state) => state.photo.favoritesPhotos);
  const accessPhotos = useAppSelector((state) => state.photo.accessedPhotos);

  const photoUploading = useAppSelector((state) => state.photo.uploading);

  const isCarouselOpened = useAppSelector((state) => state.photoCarousel.isCarouselOpened);
  const dispatch = useAppDispatch();

  let photosTypeToLoad = new Map<PhotosType, Photo[]>();
  photosTypeToLoad.set('OWN', ownPhotos);
  photosTypeToLoad.set('FAVORITE', favoritePhotos);
  photosTypeToLoad.set('ACCESS', accessPhotos);

  const onMarkerPress = (markerIndex: number) => {
    setTimeout(() => {
      markerRefs[markerIndex]?.current?.hideCallout();
      markerRefs[markerIndex]?.current?.showCallout();
    }, 200);
  }

  const onCalloutPress = (markerIndex: number) => {
    dispatch(loadPhotos(mapState.photoMarkers));
    dispatch(openPhotoCarousel(markerIndex));
  }

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
      if (mapState.photoMarkers.length !== photosToFilter.length) {
        const markers = photosToFilter.filter((photo) => photo.longitude && photo.latitude);
        dispatch(loadMarkers(markers));
      }
    }, [ownPhotos, favoritePhotos])
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
    if (ownPhotos.length === 0) {
      dispatch(getOwnPhotos());
    }
  }, []);

  const renderedMarkers = mapState.photoMarkers.map((photo, index) => {
    return (
      <Marker
        key={photo._id}
        ref={markerRefs[index]}
        coordinate={{
          latitude: photo.latitude,
          longitude: photo.longitude,
        }}
        onPress={() => onMarkerPress(index)}
      >
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
    )
  });

  return (photoUploading || mapState.loading) && mapState.isFocused ? <LoadingScreen /> : (
    <View style={styles.flex}>
      <StatusBar translucent />
      <MapView
        rotateEnabled={false}
        provider={PROVIDER_GOOGLE}
        style={styles.flex}
      >
        {renderedMarkers}
      </MapView>
    </View>
  )
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
