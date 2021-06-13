import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ImageLibrary from '../screens/main/ImageLibrary';
import FeaturedImages from '../screens/main/FeaturedImages';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const { width } = useWindowDimensions();

  const indicatorWidth = width / 2 - 40 * 2;

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
          left: (width / 2 - indicatorWidth) / 2,
          ...styles.indicator,
        },
        labelStyle: styles.label,
      }}
      screenOptions={({ route }) => ({
        tabBarLabel: '',
        tabBarIcon: ({ color, focused }) => {
          let iconName: 'image-multiple' | 'image-multiple-outline' | 'star' | 'star-outline' = 'image-multiple';
          if (route.name === 'Featured') {
            iconName = focused ? 'star' : 'star-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={26} color={color} />
        }
      })}
    >
      <Tab.Screen name='PhotoLibrary' component={ImageLibrary} />
      <Tab.Screen name='Featured' component={FeaturedImages} />
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
    color: '#3a2c3a'
  },
});

export default TabNavigator;
