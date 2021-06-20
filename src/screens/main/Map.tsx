import React, { RefObject, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Svg, Image as ImageSVG } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loadMarkers } from '../../redux/slices/photoSlice';
import { loadCurrentUserOwnPhotos } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';
import { loadPhotos, openPhotoCarousel } from '../../redux/slices/photoCarouselSlice';

const Map = () => {
  const [markerRefs, setMarkerRefs] = useState<RefObject<Marker>[]>([]);

  const navigation = useNavigation();

  const photoState = useAppSelector((state) => state.photo);
  const isCarouselOpened = useAppSelector((state) => state.photoCarousel.isCarouselOpened);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.3)');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (photoState.loadedOwnPhotos.length > 0) {
        if (photoState.photoMarkers.length !== photoState.loadedOwnPhotos.length) {
          const markers = photoState.loadedOwnPhotos.filter((photo) => photo.longitude && photo.latitude);
          dispatch(loadMarkers(markers));
        }
      }
    }, [photoState.loadedOwnPhotos])
  );

  useEffect(() => {
    setMarkerRefs((markerRefs) =>
      Array(photoState.photoMarkers.length)
        .fill(0)
        .map((_, i) => markerRefs[i] || React.createRef())
    );
  }, [photoState.photoMarkers.length]);

  useEffect(() => {
    if (isCarouselOpened) {
      navigation.navigate('PhotoCarousel');
    }
  }, [isCarouselOpened]);

  useEffect(() => {
    if (photoState.loadedOwnPhotos.length === 0) {
      dispatch(loadCurrentUserOwnPhotos());
    }
  }, []);

  const renderedMarkers = photoState.photoMarkers.map((photo, index) => {
    return (
      <Marker
        key={photo._id}
        ref={markerRefs[index]}
        coordinate={{
          latitude: photo.latitude,
          longitude: photo.longitude,
        }}
        onPress={() => {
          setTimeout(() => {
            markerRefs[index]?.current?.hideCallout();
            markerRefs[index]?.current?.showCallout();
          }, 200);
        }}
      >
        <Callout
          onPress={() => {
            dispatch(loadPhotos(photoState.photoMarkers));
            dispatch(openPhotoCarousel(index));
          }}
        >
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

  return photoState.uploading ? <LoadingScreen /> : (
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
  }
});

export default Map;
