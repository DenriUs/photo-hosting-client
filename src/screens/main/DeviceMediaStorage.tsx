import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';
import { useAppDispatch } from '../../hooks/redux';
import { uploadPhoto } from '../../api/requests/photo';
import * as ImageManipulator from 'expo-image-manipulator';
import { ExifData } from '../../other/types';

const DeviceMediaStorage = () => {
  const dispatch = useAppDispatch();

  const checkMediaLibraryPermission = async () => {
    const { granted } = await ImagePicker.getCameraPermissionsAsync();
    if (!granted) {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return false;
    }
    return true;
  }

  const getImage = async () => {
    if (!await checkMediaLibraryPermission()) {
      alert('Для завантаження зображень потрібно надати дозвіл.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
      quality: 0.5,
    });
    if (result.cancelled) return;
    const exifData: ExifData = {
      cameraModel: result.exif?.Model,
      apertureValue: result.exif?.ApertureValue,
      exposureTime: result.exif?.ExposureTime,
      focalLenght: result.exif?.FocalLength,
      iso: result.exif?.ISOSpeedRatings,
      creationDate: result.exif?.DateTime || new Date().toISOString(),
      width: result.exif?.ImageWidth,
      height: result.exif?.ImageLength,
      latitude: result.exif?.GPSLatitude,
      longitude: result.exif?.GPSLongitude,
    }
    dispatch(uploadPhoto({ uri: result.uri, exifData }));
  }

  return (
    <View style={styles.buttonWrapper}>
      <IconButton
        icon='plus'
        size={40}
        color='#ffffff'
        onPress={getImage}
        style={styles.button}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'absolute',
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 12,
    zIndex: 1,
    borderWidth: 2,
    borderRadius: 65,
    borderColor: '#ffffff',
    backgroundColor: '#3a2c3a',
  },
  button: {
    height: 60,
    width: 60,
  },
});

export default DeviceMediaStorage;
