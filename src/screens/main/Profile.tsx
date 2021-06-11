import React, { useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }, [])
  )

  return (
    <View style={[styles.flex, styles.container]}>
      <StatusBar translucent />
      <View style={styles.header}>
      </View>
      <View style={[styles.flex, styles.contentContainer]}>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: '30%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e0ce',
  },
  contentContainer: {
    width: '105%',
    alignItems: 'center',
    borderTopEndRadius: 80,
    borderTopStartRadius: 80,
    backgroundColor: '#ffffff',
  },
});

export default Profile;
