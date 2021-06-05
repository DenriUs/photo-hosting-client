import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Main from '../screens/main/Main';

const AppStack = createStackNavigator();
const appNavigatorScreenOptions: StackNavigationOptions = { headerShown: false };

const MainNavigator = () => (
  <AppStack.Navigator screenOptions={appNavigatorScreenOptions}>
    <AppStack.Screen name='Main' component={Main} />
  </AppStack.Navigator>
);

export default MainNavigator;
