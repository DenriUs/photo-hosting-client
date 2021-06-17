import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendGetRequest } from '../methods';
import { RejectedValue } from '../types';

export const loadCurrentUserData = createAsyncThunk<
  any,
  void,
  { rejectValue: RejectedValue }
>('user/getCurrentUserData', async (_void, { rejectWithValue }) => {
  const response = await sendGetRequest('/user/getCurrentUserData');
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});
