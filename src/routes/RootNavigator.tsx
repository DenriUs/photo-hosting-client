import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import { AxiosHelper } from '../helpers/api';
import { checkAuthStatus } from '../api/requests/authorization';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import LoadingScreen from '../screens/other/LoadingScreen';
import Authorization from '../screens/entry/Authorization';
import PhotoCarousel from '../screens/main/PhotoCarousel';

const AppStack = createStackNavigator();

const RootNavigator = () => {
  const isAuthStatusChecked = useAppSelector((state) => state.auth.isAuthStatusChecked);
  const isAuthorized = useAppSelector((state) => state.auth.isAuthorized);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await AxiosHelper.updateAxiosInstance();
      dispatch(checkAuthStatus());
    })();
  }, []);

  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode='none'>
        {!isAuthStatusChecked ? (
          <AppStack.Screen name='LoadingScreen' component={LoadingScreen} />
        ) : isAuthorized ? (
          <AppStack.Screen name='Authorization' component={Authorization} />
        ) : (
          <>
            <AppStack.Screen name='MainNavigator' component={MainNavigator} />
            <AppStack.Screen name='ImageDetails' component={PhotoCarousel} />
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
