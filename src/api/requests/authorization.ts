import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendPostRequest } from '../methods';
import { AxiosHelper, updateStorageAuthToken } from '../../helpers/api';
import { RejectedValue } from '../types';

export const loginAccount = createAsyncThunk<
  any,
  { login: string, password: string },
  { rejectValue: RejectedValue }
>('auth/login', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/login', data);
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
>('auth/register', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/register', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});
