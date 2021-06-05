import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Authorization from '../screens/entry/Authorization';
import MainNavigator from './MainNavigator';
import { View } from 'react-native';

const AppStack = createStackNavigator();
const appNavigatorScreenOptions: StackNavigationOptions = { headerShown: false };

const AppNavigator = () => (
  <NavigationContainer>
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <AppStack.Navigator screenOptions={appNavigatorScreenOptions}>
        <AppStack.Screen name='Authorization' component={Authorization} />
        <AppStack.Screen name='MainNavigator' component={MainNavigator} />
      </AppStack.Navigator>
    </View>
  </NavigationContainer>
);

export default AppNavigator;
