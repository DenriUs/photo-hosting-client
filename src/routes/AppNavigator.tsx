import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Authorization from '../screens/entry/Authorization';

const AppStack = createStackNavigator();
const appNavigatorScreenOptions = { headerShown: false };

const AppNavigator = () => (
  <NavigationContainer>
    <AppStack.Navigator screenOptions={appNavigatorScreenOptions}>
      <AppStack.Screen name="Authorization" component={Authorization} />
    </AppStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
