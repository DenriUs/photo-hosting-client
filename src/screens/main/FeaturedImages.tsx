import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../hooks/redux';
import { openPhotoDetails } from '../../redux/slices/photoSlice';

const FeaturedPhotos = () => {
  const dispatch = useAppDispatch();

  // const { width } = useWindowDimensions();

  // const data = Array(39)
  //   .fill(0)
  //   .map((_, index) => (
  //     <TouchableOpacity onPress={() => {
  //         dispatch(openPhotoDetails({
  //           id: index.toString(), authorId: index.toString(),
  //           creationDate: Date.now(),
  //           url: `https://picsum.photos/200/300?random=${index + 39}`,
  //         }));
  //       }
  //     }>
  //       <View style={styles.imageWrapper}>
  //         <Image source={{ uri: `https://picsum.photos/200/300?random=${index + 39}` }} style={{ width: width / 3.05, height: width / 3 }} />
  //       </View>
  //     </TouchableOpacity>
  // ));

  const renderItem = useCallback(
    ({ item }) => (
      <View>
        {item}
      </View>
    ),
    []
  );
  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      numColumns={3}
      data={[]}
      keyExtractor={(_element, index) => index.toString()}
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

export default FeaturedPhotos;
