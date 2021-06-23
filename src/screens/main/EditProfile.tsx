import React, { useCallback, RefObject } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  ImageBackground,
  GestureResponderEvent,
  TextInput as RNTextInput,
  useWindowDimensions,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation, useNavigationState } from '@react-navigation/native';
import { Appbar, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { FORM_ICON_SIZE } from '../../other/constants';
import TextInput from '../../components/inputs/TextInput';
import { useFormik } from 'formik';
import { MaterialIcons } from '@expo/vector-icons';
import { editProfileSchema } from '../../other/formValidationSchemas';
import {
  pickProfileImage,
  pickBackgroundImage,
  cleanUpLastResponseStatus,
} from '../../redux/slices/editUserSlice';
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import { updateBackgroundPhoto, updateProfilePhoto } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';

const EditProfile = () => {
  const editUserState = useAppSelector((state) => state.editUser);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();

  const checkMediaLibraryPermission = async () => {
    const { granted } = await ImagePicker.getCameraPermissionsAsync();
    if (!granted) {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return false;
    }
    return true;
  };

  const onHeaderBackActionPress = () => {
    navigation.goBack();
  }

  const closeModal = () => {
    dispatch(cleanUpLastResponseStatus());
  };

  const chooseProfleImage = async () => {
    if (!(await checkMediaLibraryPermission())) {
      alert('Для завантаження зображень потрібно надати дозвіл.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (result.cancelled) return;
    dispatch(pickProfileImage(result.uri));
    dispatch(updateProfilePhoto({ uri: result.uri }));
  };

  const chooseBackroundImage = async () => {
    if (!(await checkMediaLibraryPermission())) {
      alert('Для завантаження зображень потрібно надати дозвіл.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (result.cancelled) return;
    dispatch(pickBackgroundImage(result.uri));
    dispatch(updateBackgroundPhoto({ uri: result.uri }));
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.3)');
      StatusBar.setBarStyle('light-content');
    }, [])
  );
  return userState.profilePhotoUpdating ? <LoadingScreen /> : (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent />
      <SuccessModal
        isVisible={!!editUserState.lastResponseStatus.success.message}
        text={editUserState.lastResponseStatus.success.message}
        onBackdropPress={closeModal}
        onCloseButtonPress={closeModal}
      />
      <ErrorModal
        isVisible={editUserState.lastResponseStatus.error.isRequestResult}
        text="Нам дуже шкода, але сталася невідома помилка."
        onBackdropPress={closeModal}
        onCloseButtonPress={closeModal}
      />
      <View style={styles.container}>
        <View style={{ height: height / 2, width: '100%' }}>
          <ImageBackground
            resizeMode="cover"
            {...(editUserState.backgroundPhoto
              ? { source: { uri: editUserState.backgroundPhoto } }
              : userState.userData.backgroundPhotoUrl
              ? { source: { uri: userState.userData.backgroundPhotoUrl } }
              : { source: require('../../../assets/default-background-image.png') })}
            style={{ width: '100%', height: '100%' }}
          />
          <IconButton
            icon="image-edit-outline"
            color="#3a2c3a"
            size={25}
            onPress={chooseBackroundImage}
            style={styles.editBackgroundImageButton}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
          }}>
          <View style={styles.profileContainer}>
            <View style={styles.profileContentContainer}>
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <View style={styles.profileImageWrapper}>
                  <Image
                    {...(editUserState.profilePhoto
                      ? { source: { uri: editUserState.profilePhoto } }
                      : userState.userData.profilePhotoUrl
                      ? { source: { uri: userState.userData.profilePhotoUrl } }
                      : { source: require('../../../assets/default-profile-image.png') })}
                    style={styles.profileImage}
                  />
                  <IconButton
                    icon="image-edit"
                    color="#3a2c3a"
                    size={25}
                    onPress={chooseProfleImage}
                    style={styles.editProfileImageButton}
                  />
                </View>
                <Button
                  uppercase={false}
                  color="#3a2c3a"
                  onPress={() => navigation.goBack()}
                  labelStyle={{ letterSpacing: 0.5, fontSize: 16 }}
                  style={{ width: '96%', marginTop: 20, borderRadius: 80 }}
                >
                  <Text>Назад</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#f5e0ce',
  },
  editBackgroundImageButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 42,
    right: 3,
    backgroundColor: '#fff',
    elevation: 6,
  },
  editProfileImageButton: {
    position: 'absolute',
    marginTop: '65%',
    marginLeft: '65%',
    backgroundColor: '#fff',
    elevation: 6,
  },
  exitButton: {
    marginTop: 20,
    marginRight: 20,
    zIndex: 1,
  },
  scrollViewContent: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileContainer: {
    width: '95%',
    height: 150,
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#ffffff',
    elevation: 6,
  },
  profileContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'absolute',
    top: '-35%',
    borderWidth: 5,
    borderRadius: 80,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 80,
  },
  loginText: {
    fontSize: 25,
    color: '#3a2c3a',
  },
  emailText: {
    fontSize: 17,
    color: 'grey',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  textInputWrapper: {
    width: '90%',
    borderColor: '#3a2c3a',
  },
  textInputLeft: {
    marginLeft: 15,
  },
  textInputRight: {
    marginLeft: 0,
    marginRight: 12,
  },
  textInputLabelWrapper: {
    width: '90%',
  },
  textInputLabel: {
    fontSize: 15,
    color: '#3a2c3a',
  },
  textInputSubLabel: {
    fontSize: 12.5,
    color: '#ff302b',
  },
  changeButton: {
    width: '70%',
    borderRadius: 23,
    borderWidth: 0.2,
    marginTop: 15,
    borderColor: '#000000',
  },
  submitButtonLabel: {
    fontSize: 15,
    letterSpacing: 0.5,
    padding: 4,
  },
  submitButtonWrapper: {
    width: '65%',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 5,
    borderRadius: 26,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    elevation: 6,
    zIndex: 999,
  },
  submitButton: {
    width: '100%',
    borderRadius: 23,
    zIndex: 999,
  },
});

export default EditProfile;
