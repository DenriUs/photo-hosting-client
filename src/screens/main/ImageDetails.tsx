import React from 'react';
import { Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ImageDetails = () => {
    const route = useRoute();
    const { item } = route.params as { item: { id: string, photoUrl: string } };
    console.log(item);
    return (
      <Image source={require('../../../assets/profile-image.png')} />
    );
  };

export default ImageDetails