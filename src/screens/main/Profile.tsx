import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconButton, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import GalleryNavigator from '../../routes/GalleryNavigator';
import { logoutAccount } from '../../redux/slices/authSlice';
import { getAccessedPhotos, getFavoritePhotos, getOwnPhotos } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtAsyncStorageKeyName, maxProfileLoginLength } from '../../other/constants';
import { PhotosType } from '../../redux/types';
import { AsyncThunk } from '@reduxjs/toolkit';
import { RejectedValue } from '../../api/types';

const Profile = () => {
  const userState = useAppSelector((state) => state.user);
  const photoState = useAppSelector((state) => state.photo);
  const isCarouselOpened = useAppSelector((state) => state.photoCarousel.isCarouselOpened);
  const carouselMode = useAppSelector((state) => state.photoCarousel.carouselMode);
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const { width } = useSafeAreaFrame();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['52%', '100%'], []);

  const photosTypeToLoad = new Map<
    PhotosType,
    AsyncThunk<any, void, { rejectValue: RejectedValue }>
  >();
  photosTypeToLoad.set('OWN', getOwnPhotos);
  photosTypeToLoad.set('FAVORITE', getFavoritePhotos);
  photosTypeToLoad.set('ACCESS', getAccessedPhotos);

  const logout = async () => {
    await AsyncStorage.setItem(jwtAsyncStorageKeyName, '');
    dispatch(logoutAccount());
  };

  useFocusEffect(
    useCallback(() => {
      if (photoState.uploading) return;
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.3)');
      StatusBar.setBarStyle('light-content');
    }, [photoState.uploading])
  );

  useEffect(() => {
    if (isCarouselOpened) {
      navigation.navigate('PhotoCarousel');
    }
  }, [isCarouselOpened]);

  useEffect(() => {
    if (photoState.ownPhotos.length === 0) {
      dispatch(getOwnPhotos());
    }
  }, []);

  return photoState.uploading ? (
    <LoadingScreen />
  ) : (
    <SafeAreaView style={styles.flex}>
      <StatusBar translucent />
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          source={{ uri: 'https://picsum.photos/800/800?random=10' }}
          style={{ width: '100%', height: '100%' }}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl
                refreshing={photoState.loading}
                onRefresh={() => {
                  const loadAction = photosTypeToLoad.get(carouselMode);
                  if (loadAction) {
                    dispatch(loadAction());
                  }
                }}
                colors={['#3a2c3a', '#f7623c']}
              />
            }
            style={styles.scrollView}>
            <View style={styles.profileContainer}>
              <View style={styles.profileContentContainer}>
                <View style={{ flex: 1, height: '100%' }}></View>
                <View style={{ flex: 1, alignItems: 'center', top: '-15%' }}>
                  <View style={styles.profileImageWrapper}>
                    <Image
                      source={{ uri: 'https://picsum.photos/800/800?random=1' }}
                      style={styles.profileImage}
                    />
                  </View>
                  <View style={[{ alignItems: 'center' }, { width }]}>
                    <Title style={styles.loginText}>
                      {userState.userData.login.length > maxProfileLoginLength
                        ? userState.userData.login.substring(0, maxProfileLoginLength - 3) + '...'
                        : userState.userData.login}
                    </Title>
                    <Text style={styles.emailText}>
                      {userState.userData.email.length > maxProfileLoginLength
                        ? userState.userData.email.substring(0, maxProfileLoginLength - 3) + '...'
                        : userState.userData.email}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1, height: '100%', alignItems: 'flex-end' }}>
                  <IconButton
                    icon="logout"
                    color="#3a2c3a"
                    size={25}
                    onPress={logout}
                    style={styles.exitButton}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
      <View style={styles.flex}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          overDragResistanceFactor={0}
          handleComponent={() => null}>
          <GalleryNavigator />
        </BottomSheet>
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
    height: '50%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f5e0ce',
  },
  editButton: {
    marginTop: 20,
    marginLeft: 20,
    zIndex: 1,
  },
  exitButton: {
    marginTop: 20,
    marginRight: 20,
    zIndex: 1,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileContainer: {
    width: '95%',
    alignItems: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#ffffff',
  },
  profileContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageWrapper: {
    borderWidth: 5,
    borderRadius: 80,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
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
});

export default Profile;
