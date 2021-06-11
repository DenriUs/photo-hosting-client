import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';

const DeviceMediaStorage = () => {
  const checkMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Вибачте, але для того, щоб завантажувати фото потрібно надати дозвіл!');
      return;
    }
  }

  const getImage = async () => {
    await checkMediaLibraryPermission();
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
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
