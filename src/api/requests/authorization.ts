import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosHelper } from '../../helpers/api';
import { jwtAsyncStorageKeyName } from '../../other/constants';
import { sendGetRequest, sendPostRequest } from '../methods';
import { GetResponse, PostResponse } from '../types';

export const loginAccount = createAsyncThunk<
  any,
  { login: string; password: string },
  { rejectValue: { error: string; isServerError?: boolean } }
>('auth/login', async ({ login, password }, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/login', { login, password });
  await AsyncStorage.setItem(jwtAsyncStorageKeyName, response.data.accessToken);
  if (response.error) {
    return rejectWithValue({ error: response.error, isServerError: response.isServerError });
  }
});

export const registerAccount = async (
  login: string,
  email: string,
  password: string
): Promise<PostResponse> => {
  return sendPostRequest('/auth/register', {
    login,
    email,
    password,
  });
};

export const logoutAccount = async (): Promise<void> => {
  await AsyncStorage.setItem(jwtAsyncStorageKeyName, '');
  await AxiosHelper.updateAxiosInstance();
};

export const checkAuthStatus = createAsyncThunk<
  any,
  void,
  { rejectValue: { error: string; isServerError?: boolean } }
>('auth/checkAuthStatus', async (_void, { rejectWithValue }) => {
  const response = await sendGetRequest('/auth/checkAuthStatus');
  if (response.error) {
    return rejectWithValue({ error: response.error, isServerError: response.isServerError });
  }
});
