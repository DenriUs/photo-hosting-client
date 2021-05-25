import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Authorization from '../screens/entry/Authorization';
import Main from '../screens/main/Main';

const AppStack = createStackNavigator();
const appNavigatorScreenOptions = { headerShown: false };

const AppNavigator = () => (
  <NavigationContainer>
    <AppStack.Navigator screenOptions={appNavigatorScreenOptions}>
      <AppStack.Screen name='Authorization' component={Authorization} />
      <AppStack.Screen name='Main' component={Main} />
    </AppStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
