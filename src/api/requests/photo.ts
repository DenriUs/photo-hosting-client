import mime from 'mime';
import FormData from 'form-data';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RejectedValue } from '../types';
import { sendGetRequest, sendPostRequest } from '../methods';
import { ExifData } from '../../other/types';

const getFileUploadFormData = (fileUri: string, body?: ExifData): FormData => {
  const formData = new FormData();
  formData.append('photo', {
    uri: fileUri,
    type: mime.getType(fileUri),
    name: fileUri.split('/').pop(),
  });
  if (body) {
    Object.keys(body).forEach((key) => {
      //@ts-ignore
      formData.append(key, body[key]);
    });
  }
  return formData;
};

export const uploadPhoto = createAsyncThunk<
  any,
  { uri: string; exifData: ExifData },
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

export const getOwnPhotos = createAsyncThunk<any, void, { rejectValue: RejectedValue }>(
  'photo/getOwnPhotos',
  async (_void, { rejectWithValue }) => {
    const response = await sendGetRequest('/photo/getOwnPhotos');
    if (response.error) {
      return rejectWithValue({
        error: response.error.message,
        isServerError: response.error.isServerError,
      });
    }
    return response.data;
  }
);

export const addFavoritePhoto = createAsyncThunk<
  any,
  { userId: string; favoritePhotoId: string },
  { rejectValue: { error: string; isServerError?: boolean; favoritePhotoId: string } }
>('photo/addFavorite', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/addFavorite', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
      favoritePhotoId: data.favoritePhotoId,
    });
  }
  return response.data;
});

export const removeFavoritePhoto = createAsyncThunk<
  any,
  { userId: string; favoritePhotoId: string },
  { rejectValue: { error: string; isServerError?: boolean; favoritePhotoId: string } }
>('photo/removeFavorite', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/removeFavorite', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
      favoritePhotoId: data.favoritePhotoId,
    });
  }
  return response.data;
});

export const getFavoritePhotos = createAsyncThunk<any, void, { rejectValue: RejectedValue }>(
  'photo/getFavoritePhotos',
  async (_void, { rejectWithValue }) => {
    const response = await sendGetRequest('/photo/getFavoritePhotos');
    if (response.error) {
      return rejectWithValue({
        error: response.error.message,
        isServerError: response.error.isServerError,
      });
    }
    return response.data;
  }
);

export const addAccessedPhoto = createAsyncThunk<
  any,
  { userId: string; accessedPhotoId: string },
  { rejectValue: { error: string; isServerError?: boolean } }
>('photo/addAccessed', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/addAccessed', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});

export const getAccessedPhotos = createAsyncThunk<any, void, { rejectValue: RejectedValue }>(
  'photo/getAccessedPhotos',
  async (_void, { rejectWithValue }) => {
    const response = await sendGetRequest('/photo/getAccessedPhotos');
    if (response.error) {
      return rejectWithValue({
        error: response.error.message,
        isServerError: response.error.isServerError,
      });
    }
    return response.data;
  }
);

export const updatePhoto = createAsyncThunk<
  any,
  { id: string; latitude: number; longitude: number },
  { rejectValue: RejectedValue }
>('photo/update', async (data, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/update', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});

export const updateProfilePhoto = createAsyncThunk<
  any,
  { uri: string },
  { rejectValue: RejectedValue }
>('photo/updateProfilePhoto', async ({ uri }, { rejectWithValue }) => {
  const response = await sendPostRequest('/photo/updateProfilePhoto', getFileUploadFormData(uri), {
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

export const updateBackgroundPhoto = createAsyncThunk<
  any,
  { uri: string },
  { rejectValue: RejectedValue }
>('photo/updateBackgroundPhoto', async ({ uri }, { rejectWithValue }) => {
  const response = await sendPostRequest(
    '/photo/updateBackgroundPhoto',
    getFileUploadFormData(uri),
    {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  );
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});
