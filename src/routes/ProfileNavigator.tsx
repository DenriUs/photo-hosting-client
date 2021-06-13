import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/main/Profile';
import ImageDetails from '../screens/main/ImageDetails';

const ProfileStack = createStackNavigator();

const ProfileNavigator = () => (
  <NavigationContainer>
    <ProfileStack.Navigator headerMode='none'>
      <ProfileStack.Screen name='Profile' component={Profile} />
      <ProfileStack.Screen name='ImageDetails' component={ImageDetails} />
    </ProfileStack.Navigator>
  </NavigationContainer>
);

export default ProfileNavigator;
