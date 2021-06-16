import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconButton, Title } from 'react-native-paper';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import PhotoLibraryNavigator from '../../routes/PhotoLibraryNavigator';
import { loadPhotos } from '../../redux/slices/photoSlice';

const Profile = () => {
  const photoState = useAppSelector((state) => state.photo);
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['52%', '100%'], []);
  
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  useEffect(() => {
    if (photoState.isCarouselOpened) {
      navigation.navigate('ImageDetails');
    }
  }, [photoState.isCarouselOpened]);

  useEffect(() => {
    dispatch(loadPhotos(Array(39).fill(0).map((_, index) => ({
      id: index.toString(),
      authorId: index.toString(),
      url: `https://picsum.photos/800/800?random=1`,
      creationDate: Date.now(),
    }))));
  }, []);

  return (
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
                <Title style={styles.loginText}>Login</Title>
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
            <PhotoLibraryNavigator />
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
    justifyContent: 'flex-end',
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
    borderColor: '#ffffff',
    borderWidth: 5,
    borderRadius: 80,
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
