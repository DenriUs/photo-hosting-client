import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime';
import { Platform } from 'react-native';
import { jwtAsyncStorageKeyName } from '../../other/constants';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

const getFileUploadFormData = (fileUri: string): FormData => {
  const formData = new FormData();
  formData.append('file', {
    uri : fileUri,
    type: mime.getType(fileUri),
    name: fileUri.split('/').pop()
  });
  return formData;
}

export const uploadPhoto = createAsyncThunk<
  any,
  { uri: string },
  { rejectValue: RejectedValue }
>('photo/upload', async ({ uri }, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/upload', getFileUploadFormData(uri), {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  });
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
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
