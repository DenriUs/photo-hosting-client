import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Map from '../screens/main/Map';
import DeviceMediaStorage from '../screens/main/DeviceMediaStorage';
import ProfileNavigator from './ProfileNavigator';

const MainTab = createMaterialBottomTabNavigator();

const MainNavigator = () => (
  <>
    <DeviceMediaStorage />
    <MainTab.Navigator
      shifting
      labeled={false}
      activeColor='#f7623c'
      inactiveColor='rgba(0, 0, 0, 0.2)'
      barStyle={styles.tabBarStyle}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let config: {
            icon: 'home' | 'home-outline' | 'account' | 'account-outline',
            style: {},
          } = { icon: 'home', style: {} };
          if (route.name === 'Map') {
            config.icon = focused ? 'home' : 'home-outline';
            config.style = styles.mapTab;
          } else if (route.name === 'Profile') {
            config.icon = focused ? 'account' : 'account-outline';
            config.style = styles.profileTab;
          }
          return <MaterialCommunityIcons name={config.icon} size={28} color={color} style={config.style} />
        },
      })}
    >
      <MainTab.Screen
        name='Map'
        component={Map}
      />
      <MainTab.Screen
        name='Profile'
        component={ProfileNavigator}
      />
    </MainTab.Navigator>
  </>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#ffffff',
  },
  mapTab: {
    left: -15,
  },
  profileTab: {
    left: 15,
  },
});

export default MainNavigator;
