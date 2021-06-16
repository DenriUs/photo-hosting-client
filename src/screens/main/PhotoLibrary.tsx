import React, { useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { openPhotoCarousel, openPhotoDetails } from '../../redux/slices/photoSlice';

const PhotoLibrary = () => {
  const ownPhotos = useAppSelector((state) => state.photo.loadedOwnPhotos);
  const dispatch = useAppDispatch();

  const { width } = useWindowDimensions();

  const data = ownPhotos.map((photo, index) => ({ index, ...photo }));

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => dispatch(openPhotoCarousel(item.index))}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.url }} style={{ width: width / 3.05, height: width / 3 }} />
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      numColumns={3}
      data={data}
      keyExtractor={(photo) => photo.id}
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

export default PhotoLibrary;