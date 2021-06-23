import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

export const loadComments = createAsyncThunk<
  any,
  { photoId: string },
  { rejectValue: RejectedValue }
>('comment/getComments', async (data, { rejectWithValue }) => {
  const response = await sendGetRequest(`/comment/getComments/${data.photoId}`);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});

export const addComment = createAsyncThunk<
  any,
  { photoId: string; authorId: string; creationDate: string; text: string },
  { rejectValue: RejectedValue }
>('comment/addComment', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/comment/addComment', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data
});
