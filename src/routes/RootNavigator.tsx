import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import { AxiosHelper } from '../helpers/api';
import { checkAuthStatus } from '../api/requests/authorization';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import LoadingScreen from '../screens/other/LoadingScreen';
import Authorization from '../screens/entry/Authorization';

const AppStack = createStackNavigator();

const RootNavigator = () => {
  const authState = useAppSelector((state) => state.auth);
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
        {!authState.isAuthStatusChecked ? (
          <AppStack.Screen name='LoadingScreen' component={LoadingScreen} />
        ) : authState.isAuthorized ? (
          <AppStack.Screen name='Authorization' component={Authorization} />
        ) : (
          <AppStack.Screen name='MainNavigator' component={MainNavigator} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
