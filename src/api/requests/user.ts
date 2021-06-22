import mime from 'mime';
import { createAsyncThunk } from '@reduxjs/toolkit';
import FormData from 'form-data';
import { sendGetRequest, sendPostRequest } from '../methods';
import { RejectedValue } from '../types';

const getPhotosUploadFormData = (
  profilePhotoUri: string,
  backgroundPhotoUri: string,
  body: {}
): FormData => {
  const formData = new FormData();
  if (profilePhotoUri) {
    formData.append('profilePhoto', {
      uri: profilePhotoUri,
      type: mime.getType(profilePhotoUri),
      name: profilePhotoUri.split('/').pop(),
    });
  }
  if (backgroundPhotoUri) {
    formData.append('backgroundPhoto', {
      uri: backgroundPhotoUri,
      type: mime.getType(backgroundPhotoUri),
      name: backgroundPhotoUri.split('/').pop(),
    });
  }
  Object.keys(body).forEach((key) => {
    //@ts-ignore
    formData.append(key, body[key]);
  });
  return formData;
};

export const loadCurrentUserData = createAsyncThunk<any, void, { rejectValue: RejectedValue }>(
  'user/getCurrentUserData',
  async (_void, { rejectWithValue }) => {
    const response = await sendGetRequest('/user/getCurrentUserData');
    if (response.error) {
      return rejectWithValue({
        error: response.error.message,
        isServerError: response.error.isServerError,
      });
    }
    return response.data;
  }
);

export const updateUser = createAsyncThunk<
  any,
  { login: string; profilePhotoUri: string; backgroundPhotoUri: string },
  { rejectValue: RejectedValue }
>('user/update', async (data, { rejectWithValue }) => {
  const bodyData =
    data.profilePhotoUri && data.backgroundPhotoUri
      ? getPhotosUploadFormData(data.profilePhotoUri, data.backgroundPhotoUri, {
          login: data.login,
        })
      : data.login;
  const response = await sendPostRequest('/user/update', data);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});

export const searchUsersToSharePhoto = createAsyncThunk<
  any,
  { photoId: string; loginPart: string },
  { rejectValue: RejectedValue }
>('user/searchToSharePhoto', async ({ photoId, loginPart }, { rejectWithValue }) => {
  const response = await sendGetRequest(`/user/searchToSharePhoto/${photoId}/${loginPart}`);
  if (response.error) {
    return rejectWithValue({
      error: response.error.message,
      isServerError: response.error.isServerError,
    });
  }
  return response.data;
});
