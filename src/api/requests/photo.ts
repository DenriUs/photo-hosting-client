import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime';
import { Platform } from 'react-native';
import { jwtAsyncStorageKeyName } from '../../other/constants';
import { ExifData } from '../../other/types';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

const getFileUploadFormData = (fileUri: string, body: ExifData): FormData => {
  const formData = new FormData();
  formData.append('photo', {
    uri : fileUri,
    type: mime.getType(fileUri),
    name: fileUri.split('/').pop()
  });
  Object.keys(body).forEach((key) => {
    formData.append(key, body[key]);
  });
  return formData;
}

export const uploadPhoto = createAsyncThunk<
  any,
  { uri: string, exifData: ExifData },
  { rejectValue: RejectedValue }
>('photo/upload', async ({ uri, exifData }, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/upload', getFileUploadFormData(uri, exifData), {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  });
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
