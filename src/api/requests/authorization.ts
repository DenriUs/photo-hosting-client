import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendPostRequest } from '../methods';
import { AxiosHelper, updateStorageAuthToken } from '../../helpers/api';
import { RejectedValue } from '../types';

export const loginAccount = createAsyncThunk<
  any,
  { login: string; password: string },
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

export const generateResetPasswordCode = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: RejectedValue }
>('auth/generateResetPasswordCode', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/generateResetPasswordCode', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});

export const verifyResetPasswordCode = createAsyncThunk<
  any,
  { email: string; code: string },
  { rejectValue: RejectedValue }
>('auth/verifyResetPasswordCode', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/verifyResetPasswordCode', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});

export const resetPassword = createAsyncThunk<
  any,
  { email: string; code: string; newPassword: string },
  { rejectValue: RejectedValue }
>('auth/resetPassword', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/resetPassword', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});
