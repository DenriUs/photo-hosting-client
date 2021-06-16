import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/main/Profile';
import PhotoDetails from '../screens/main/PhotoCarousel';
import { useAppSelector } from '../hooks/redux';
import { useEffect } from 'react';

const ProfileStack = createStackNavigator();

const ProfileNavigator = () => (
  <ProfileStack.Navigator headerMode='none'>
    <ProfileStack.Screen name='Profile' component={Profile} />
  </ProfileStack.Navigator>
);

export default ProfileNavigator;
