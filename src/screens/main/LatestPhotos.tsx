import React, { useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeCarouselMode, changeCurrentlyViwedPhoto, loadPhotos, openPhotoCarousel } from '../../redux/slices/photoCarouselSlice';
import { useEffect } from 'react';

const LatestPhotos = () => {
  const ownPhotos = useAppSelector((state) => state.photo.ownPhotos);
  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions();

  const data = ownPhotos.map((photo, index) => ({ index, ...photo }));

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => {
        dispatch(loadPhotos(data));
        dispatch(changeCurrentlyViwedPhoto(data[item.index]));
        dispatch(changeCarouselMode('OWN'));
        dispatch(openPhotoCarousel(item.index));
      }}>
        <View style={styles.imageWrapper}>
          <Image resizeMethod='resize' source={{ uri: item.hostUrl }} style={{ width: width / 3, height: width / 3 }} />
        </View>
      </TouchableOpacity>
    ),
    [],
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
}

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderTopWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#ffffff',
  },
  bottomSheetContentContainer: {
    alignItems: 'center',
    marginTop: 0.5,
  },
});

export default LatestPhotos;
