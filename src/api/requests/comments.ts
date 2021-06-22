import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

export const loadComments = createAsyncThunk<
  any,
  { photoId: string },
  { rejectValue: RejectedValue }
>('auth/getComments', async (data, { rejectWithValue }) => {
  const response = await sendGetRequest(`/auth/getComment/${data.photoId}`);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});

export const addComment = createAsyncThunk<
  any,
  { photoId: string; authorId: string; creationDate: string; text: string },
  { rejectValue: RejectedValue }
>('auth/getAddComment', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/auth/getAddComment', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
});
