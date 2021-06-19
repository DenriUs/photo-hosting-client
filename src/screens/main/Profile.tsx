import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, StatusBar, Image, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconButton, Title } from 'react-native-paper';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import GalleryNavigator from '../../routes/GalleryNavigator';
import { logoutAccount } from '../../redux/slices/authSlice';
import { loadCurrentUserOwnPhotos } from '../../api/requests/photo';
import LoadingScreen from '../other/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtAsyncStorageKeyName } from '../../other/constants';

const Profile = () => {
  const userState = useAppSelector((state) => state.user);
  const photoState = useAppSelector((state) => state.photo);
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['52%', '100%'], []);

  const logout = async () => {
    await AsyncStorage.setItem(jwtAsyncStorageKeyName, '');
    dispatch(logoutAccount());
  }
  
  useFocusEffect(
    useCallback(() => {
      if (photoState.api.loading) return;
      StatusBar.setBackgroundColor('#f5e0ce');
      StatusBar.setBarStyle('dark-content');
    }, [photoState.api.loading])
  );

  useEffect(() => {
    if (photoState.isCarouselOpened) {
      navigation.navigate('PhotoCarousel');
    }
  }, [photoState.isCarouselOpened]);

  useEffect(() => {
    if (photoState.loadedOwnPhotos.length === 0) {
      dispatch(loadCurrentUserOwnPhotos());
    }
  }, []);

  return photoState.api.loading ? <LoadingScreen /> : (
    <SafeAreaView style={styles.flex}>
      <StatusBar translucent />
        <View style={styles.container}>
          <View style={[styles.flex, styles.header]}>
            <IconButton
              icon='account-edit'
              color='#3a2c3a'
              size={28}
              onPress={() => navigation.navigate('EditUser')}
              style={styles.editButton}
            />
            <Title>Профіль</Title>
            <IconButton
              icon='logout'
              color='#3a2c3a'
              size={28}
              onPress={logout}
              style={styles.editButton}
            />
          </View>
          <ScrollView
            nestedScrollEnabled={true}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            <View style={styles.profileWrapper}>
              <View style={styles.profileContentWrapper}>
                <View style={styles.profileImageWrapper}>
                  <Image source={{ uri: 'https://picsum.photos/800/800?random=1' }} style={styles.profileImage} />
                </View>
                <Title style={styles.loginText}>{userState.userData.login}</Title>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.flex}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            overDragResistanceFactor={0}
            handleComponent={() => null}
          >
            <GalleryNavigator />
          </BottomSheet>
        </View>
    </SafeAreaView>
  )
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
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: Constants.statusBarHeight,
  },
  editButton: {
    zIndex: 1,
  },
  scrollView: {
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  profileWrapper: {
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: '#ffffff',
  },
  profileContentWrapper: {
    alignItems: 'center',
    top: '-15%',
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
});

export default Profile;
