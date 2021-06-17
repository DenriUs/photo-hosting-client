import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendGetRequest, sendPostRequest } from '../methods';
import { AxiosHelper, updateStorageAuthToken } from '../../helpers/api';
import { RejectedValue } from '../types';

export const loginAccount = createAsyncThunk<
  any,
  { login: string; password: string },
  { rejectValue: RejectedValue }
>('auth/login', async ({ login, password }, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/login', { login, password });
  await updateStorageAuthToken(response.data?.accessToken || '');
  await AxiosHelper.updateAxiosInstance();
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});

export const registerAccount = createAsyncThunk<
  any,
  { login: string; email: string; password: string },
  { rejectValue: RejectedValue }
>('auth/register', async ({ login, email, password }, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/register', { login, email, password });
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});

export const checkAuthStatus = createAsyncThunk<
  any,
  void,
  { rejectValue: RejectedValue }
>('auth/checkAuthStatus', async (_void, { rejectWithValue }) => {
  const response = await sendGetRequest('/auth/checkAuthStatus');
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});
