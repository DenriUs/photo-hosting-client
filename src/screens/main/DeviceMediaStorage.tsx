import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';
import { useAppDispatch } from '../../hooks/redux';
import { uploadPhoto } from '../../api/requests/photo';

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
      allowsEditing: true,
      quality: 1,
    });
    if (result.cancelled) return;
    dispatch(uploadPhoto({ uri: result.uri }));
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
