import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, Image, StatusBar, View, ViewToken, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { LinearGradient, LinearGradientPoint } from 'expo-linear-gradient';
import moment from 'moment';
import { useState } from 'react';
import { Appbar, Title } from 'react-native-paper';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Photo } from '../../api/entities';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  changeCurrentlyViwedPhoto,
  changeOpenedPhotoIndex,
  closePhotoCarousel,
} from '../../redux/slices/photoCarouselSlice';

const PhotoCarousel = () => {
  const { width } = useSafeAreaFrame();

  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [0, '20%', '60%'], []);
  const linearGradientColors = useMemo(() => ['rgba(0,0,0,0.8)', 'transparent'], []);
  const grandientEndConfig = useMemo<LinearGradientPoint>(() => ({ x: 0, y: 1 }), []);

  const onViewRef = React.useRef<
    ((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void) | null | undefined
  >(({ changed }) => {
    bottomSheetRef.current?.snapTo(0);
    dispatch(changeOpenedPhotoIndex(changed[0].index || 0));
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

  const loadedPhotos = useAppSelector((state) => state.photoCarousel.loadedPhotos);
  const openedPhotoIndex = useAppSelector((state) => state.photoCarousel.openedPhotoIndex);
  const currentlyViewedPhoto = useAppSelector((state) => state.photoCarousel.currentlyViewedPhoto);
  const dispatch = useAppDispatch();

  const getItemLayout = (_data: Photo[] | null | undefined, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const renderItem = useCallback(
    ({ item }) => <Image resizeMode='contain' source={{ uri: item.hostUrl }} style={{ width }} />,
    [],
  );

  const onHeaderBackActionPress = () => {
    dispatch(closePhotoCarousel());
    navigation.goBack();
  }

  const onDetailsButtonPress = () => {
    dispatch(changeCurrentlyViwedPhoto(loadedPhotos[openedPhotoIndex]));
    bottomSheetRef.current?.snapTo(1);
  }

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');
      return () => dispatch(closePhotoCarousel());
    }, [])
  );

  const renderBottomSheetHandleComponent = () => (
    <View style={styles.bottomSheetHeader}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}>
        </View>
      </View>
    </View>
  );

  const renderPhotoDetailsView = () => (
    <View style={[styles.flex, styles.deatailsContainer]}>
      {currentlyViewedPhoto?.creationDate && (
        <View>
          <Title style={styles.creationDate}>
            {moment(currentlyViewedPhoto.creationDate).locale('uk').format('llll')}
          </Title>
        </View>
      )}
      <View>
        <Title style={styles.photoInfoTitle}>Інформація про фото:</Title>
      </View>
      <View style={styles.photoDetailsContainer}>
        <MaterialCommunityIcons name='image-outline' size={35} color='rgba(0, 0, 0, 0.5)' />
        <View style={styles.photoDetailsWrapper}>
          <Text>{currentlyViewedPhoto?.originalName}</Text>
          <View style={styles.photoDetails}>
            <Text style={styles.resolutionText}>
              {currentlyViewedPhoto?.width} x {currentlyViewedPhoto?.height}
            </Text>
          </View>
        </View>
      </View>
      {currentlyViewedPhoto?.cameraModel && (
        <View style={styles.cameraDetailsContainer}>
          <MaterialCommunityIcons name='camera-outline' size={35} color='rgba(0, 0, 0, 0.5)' />
          <View style={styles.cameraDetailsWrapper}>
            <Text>{currentlyViewedPhoto.cameraModel}</Text>
            <View style={styles.cameraDetails}>
              <Text style={styles.firstCameraDetailsElement}>ƒ/{currentlyViewedPhoto.apertureValue}</Text>
              <Text style={styles.nextCameraDetailsElement}>{currentlyViewedPhoto.exposureTime}</Text>
              <Text style={styles.nextCameraDetailsElement}>{currentlyViewedPhoto.focalLenght} мм</Text>
              <Text style={styles.nextCameraDetailsElement}>ISO{currentlyViewedPhoto.iso}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.flex, styles.container]}>
      <StatusBar translucent />
      <View style={styles.headerWrapper}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction color='#ffffff' onPress={onHeaderBackActionPress}
          />
          <Appbar.Content title='' />
          <Appbar.Action icon='dots-vertical' color='#ffffff' onPress={onDetailsButtonPress} />
        </Appbar.Header>
      </View>
      <LinearGradient
        colors={linearGradientColors}
        end={grandientEndConfig}
        style={styles.linearGradientView}
      />
      <FlatList
        horizontal
        pagingEnabled
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={getItemLayout}
        initialScrollIndex={openedPhotoIndex}
        data={loadedPhotos}
        keyExtractor={(photo) => photo._id}
        renderItem={renderItem}
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        overDragResistanceFactor={0}
        handleComponent={renderBottomSheetHandleComponent}
      >
        {renderPhotoDetailsView()}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#000000',
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
    backgroundColor: 'transparent',
  },
  bottomSheetHeader: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20
  },
  panelHandle: {
    width: 35,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  deatailsContainer: {
    marginTop: 15,
    marginLeft: 20,
  },
  creationDate: {
    fontSize: 17,
  },
  photoInfoTitle: {
    fontSize: 15,
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  photoDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 20,
  },
  photoDetailsWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 15,
    flexShrink: 1,
  },
  photoDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resolutionText: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  cameraDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 10,
  },
  cameraDetailsWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  cameraDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  firstCameraDetailsElement: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  nextCameraDetailsElement: {
    fontSize: 15,
    marginLeft: 15,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});

export default PhotoCarousel;
