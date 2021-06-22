import React, { useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableOpacity, Image, TouchableNativeFeedback } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
    changeCarouselMode,
  changeCurrentlyViwedPhoto,
  loadPhotos,
  openPhotoCarousel,
} from '../../redux/slices/photoCarouselSlice';
import { getAccessedPhotos } from '../../api/requests/photo';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';

const AccessedPhotos = () => {
  const areAccessedPhotosLoaded = useAppSelector((state) => state.photo.areAccessedPhotosLoaded);
  const accessedPhotos = useAppSelector((state) => state.photo.accessedPhotos);
  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions();

  const data = accessedPhotos.map((photo, index) => ({ index, ...photo }));

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          dispatch(loadPhotos(data));
          dispatch(changeCurrentlyViwedPhoto(data[item.index]));
          dispatch(openPhotoCarousel(item.index));
        }}>
        <View style={styles.imageWrapper}>
          <Image
            resizeMethod="resize"
            source={{ uri: item.hostUrl }}
            style={{ width: width / 3, height: width / 3 }}
          />
        </View>
      </TouchableRipple>
    ),
    [areAccessedPhotosLoaded, accessedPhotos]
  );

  useFocusEffect(
    useCallback(() => {
      if (!areAccessedPhotosLoaded) {
        dispatch(getAccessedPhotos());
      }
    }, [areAccessedPhotosLoaded])
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(changeCarouselMode('ACCESS'))
    }, [])
  );

  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      numColumns={3}
      initialNumToRender={20}
      disableVirtualization={false}
      data={data}
      keyExtractor={(photo) => photo._id}
      renderItem={renderItem}
      contentContainerStyle={styles.bottomSheetContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#ffffff',
  },
  bottomSheetContentContainer: {
    alignItems: 'flex-start',
    marginTop: 0.5,
  },
});

export default AccessedPhotos;
