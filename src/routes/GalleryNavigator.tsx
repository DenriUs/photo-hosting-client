import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LatestPhotos from '../screens/main/LatestPhotos';
import FavoritePhotos from '../screens/main/FavoritePhotos';
import AccessedPhotos from '../screens/main/AccessedPhotos';

const Tab = createMaterialTopTabNavigator();

const GalleryNavigator = () => {
  const { width } = useWindowDimensions();

  const indicatorWidth = width / 3 - 20 * 2;

  return (
    <Tab.Navigator
      tabBarPosition='top'
      tabBarOptions={{
        activeTintColor: '#3a2c3a',
        inactiveTintColor: 'rgba(0, 0, 0, 0.2)',
        showIcon: true,
        showLabel: false,
        indicatorStyle: {
          width: indicatorWidth,
          left: (width / 3 - indicatorWidth) / 2,
          ...styles.indicator,
        },
        labelStyle: styles.label,
      }}
      screenOptions={({ route }) => ({
        tabBarLabel: '',
        tabBarIcon: ({ color, focused }) => {
          let iconName:
            | 'image-multiple'
            | 'image-multiple-outline'
            | 'star'
            | 'star-outline'
            | 'account-group'
            | 'account-group-outline' = 'image-multiple';
          if (route.name === 'FavoritePhotos') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'AccessedPhotos') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}>
      <Tab.Screen name='LatestPhotos' component={LatestPhotos} />
      <Tab.Screen name='FavoritePhotos' component={FavoritePhotos} />
      <Tab.Screen name='AccessedPhotos' component={AccessedPhotos} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderWidth: 1,
    borderColor: '#f7623c',
  },
  label: {
    fontSize: 15,
    color: '#3a2c3a',
  },
});

export default GalleryNavigator;
