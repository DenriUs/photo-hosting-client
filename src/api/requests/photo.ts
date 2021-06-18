import { createAsyncThunk } from '@reduxjs/toolkit';
import FormData from 'form-data';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

export const uploadPhoto = createAsyncThunk<
  any,
  {},
  { rejectValue: RejectedValue }
>('photo/upload', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/upload', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});

export const loadCurrentUserOwnPhotos = createAsyncThunk<
  any,
  void,
  { rejectValue: RejectedValue }
>('photo/getOwnPhotos', async (_void, { rejectWithValue }) => {
  const response = await sendGetRequest('/photo/getOwnPhotos');
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});
