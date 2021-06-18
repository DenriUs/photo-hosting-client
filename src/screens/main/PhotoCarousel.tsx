import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList, Image, StatusBar, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { Photo } from '../../api/entities';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closePhotoCarousel } from '../../redux/slices/photoSlice';

const PhotoCarousel = () => {
  const { width } = useSafeAreaFrame();

  const navigation = useNavigation();

  const ownPhotos = useAppSelector((state) => state.photo.loadedOwnPhotos);
  const currentPhotoIndex = useAppSelector((state) => state.photo.currentPhotoIndex);
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

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000000' }}>
      <StatusBar translucent />
      <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'flex-start' }}>
        <Appbar.Header style={{ backgroundColor: 'transparent', zIndex: 1 }}>
          <Appbar.BackAction color='#ffffff' onPress={() => {
              dispatch(closePhotoCarousel());
              navigation.goBack();
            }}
          />
          <Appbar.Content title='' />
          <Appbar.Action icon='star-outline' color='#ffffff' onPress={() => {}} />
          <Appbar.Action icon='dots-vertical' color='#ffffff' onPress={() => {}} />
        </Appbar.Header>
      </View>
      <FlatList
        horizontal
        pagingEnabled
        getItemLayout={getItemLayout}
        initialScrollIndex={currentPhotoIndex}
        data={ownPhotos}
        keyExtractor={(photo) => photo._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PhotoCarousel;
