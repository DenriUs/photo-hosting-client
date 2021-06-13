import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, IconButton, Title } from 'react-native-paper';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import ImageLibraryNavigator from '../../routes/ImageLibraryNavigator';

const Profile = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['52%', '100%'], []);
  
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar translucent />
      <View style={styles.container}>
        <View style={[styles.flex, styles.header]}>
          <IconButton
              icon='cog-outline'
              color='#3a2c3a'
              size={27}
              onPress={() => console.log(12345)}
          />
          <IconButton
            icon='account-edit'
            color='#3a2c3a'
            size={28}
            onPress={() => console.log(12345)}
          />
        </View>
        <View style={styles.profileWrapper}>
          <View style={styles.profileContentWrapper}>
            <View style={styles.profileImageWrapper}>
              <Image source={require('../../../assets/profile-image.png')} style={styles.profileImage} />
            </View>
            <Title style={styles.loginText}>Username</Title>
            <Button onPress={() => console.log(12345)}><Text>Підписатися</Text></Button>
          </View>
        </View>
      </View>
      <View style={styles.flex}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          overDragResistanceFactor={0}
          handleComponent={() => null}
        >
          <ImageLibraryNavigator />
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
