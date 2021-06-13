import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

const ImageLibrary = () => {
  const { width } = useWindowDimensions();

  const data = useMemo(
    () => Array(39).fill(0)
        .map(() => (
          <TouchableOpacity onPress={() => console.log(12345)}>
            <View style={styles.imageWrapper}>
              <Image source={require('../../../assets/profile-image.png')} style={{ width: width / 3.05, height: width / 3 }} />
            </View>
          </TouchableOpacity>
        )),
    []
  );

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
      data={data}
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

export default ImageLibrary;
