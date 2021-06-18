import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/main/Profile';

const ProfileStack = createStackNavigator();

const ProfileNavigator = () => (
  <ProfileStack.Navigator headerMode='none'>
    <ProfileStack.Screen name='Profile' component={Profile} />
  </ProfileStack.Navigator>
);

export default ProfileNavigator;
