import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import { AxiosHelper } from '../helpers/api';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import LoadingScreen from '../screens/other/LoadingScreen';
import Authorization from '../screens/entry/Authorization';
import PhotoCarousel from '../screens/main/PhotoCarousel';
import { loadCurrentUserData } from '../api/requests/user';
import LocationPickerMap from '../screens/main/LocationPIckerMap';

const AppStack = createStackNavigator();

const RootNavigator = () => {
  const isAuthStatusChecked = useAppSelector((state) => state.auth.isAuthStatusChecked);
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  const authScreenReplaceAnimationType = useAppSelector(
    (state) => state.auth.authScreenReplaceAnimationType,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await AxiosHelper.updateAxiosInstance();
      dispatch(loadCurrentUserData());
    })();
  }, []);

  return (
    <NavigationContainer>
      <View style={[styles.flex, styles.navigatorContainer]}>
        <AppStack.Navigator headerMode='none'>
          {!isAuthStatusChecked ? (
            <AppStack.Screen name='LoadingScreen' component={LoadingScreen} />
          ) : !isAuthorized ? (
            <AppStack.Screen
              name='Authorization'
              component={Authorization}
              options={{ animationTypeForReplace: authScreenReplaceAnimationType }}
            />
          ) : (
            <>
              <AppStack.Screen name='MainNavigator' component={MainNavigator} />
              <AppStack.Screen name='PhotoCarousel' component={PhotoCarousel} />
              <AppStack.Screen name='LocationPickerMap' component={LocationPickerMap} />
            </>
          )}
        </AppStack.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  navigatorContainer: {
    backgroundColor: '#f5e0ce',
  }
});

export default RootNavigator;
