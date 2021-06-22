import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { PhotoState } from '../types';
import { Photo } from '../../api/entities';
import {
  addAccessedPhoto,
  addFavoritePhoto,
  getAccessedPhotos,
  getFavoritePhotos,
  getOwnPhotos,
  removeFavoritePhoto,
  updatePhoto,
  uploadPhoto,
} from '../../api/requests/photo';

const initialState: PhotoState = {
  ownPhotos: [],
  favoritesPhotos: [],
  accessedPhotos: [],
  areFavoritePhotosLoaded: false,
  areAccessedPhotosLoaded: false,
  uploading: false,
  loading: false,
  lastResponseStatus: {
    success: {
      isRequestResult: false,
      message: '',
    },
    error: {
      isRequestResult: false,
      message: '',
      isServerError: false,
    },
  },
};

const dropLastResponseStatus = (state: PhotoState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    changeApiLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      state.uploading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      state.ownPhotos.push(action.payload);
    });
    builder.addCase(updatePhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      const photoIndex = state.ownPhotos.findIndex((photo) => photo._id === action.payload._id);
      if (photoIndex !== -1) {
        state.ownPhotos[photoIndex] = action.payload;
      }
    });
    builder.addCase(addFavoritePhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      state.lastResponseStatus.success.isRequestResult = true;
      state.favoritesPhotos.push(action.payload);
    });
    builder.addCase(addAccessedPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      const sharedOwnPhotoIndex = state.ownPhotos.findIndex((photo) => photo._id === action.payload._id);
      const sharedFavoritePhotoIndex = state.favoritesPhotos.findIndex((photo) => photo._id === action.payload._id);
      if (sharedOwnPhotoIndex !== -1) {
        state.ownPhotos[sharedOwnPhotoIndex] = action.payload;
      }
      if (sharedFavoritePhotoIndex !== -1) {
        state.favoritesPhotos[sharedFavoritePhotoIndex] = action.payload;
      }
    });
    builder.addCase(removeFavoritePhoto.fulfilled, (state, action: PayloadAction<string>) => {
      state.lastResponseStatus.success.isRequestResult = true;
      const photoIndex = state.favoritesPhotos.findIndex((photo) => photo._id === action.payload);
      if (photoIndex !== -1) {
        state.favoritesPhotos.splice(photoIndex, 1);
      }
    });
    builder.addCase(getOwnPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      state.ownPhotos = action.payload;
    });
    builder.addCase(getFavoritePhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.loading = false;
      state.favoritesPhotos = action.payload;
      state.areFavoritePhotosLoaded = true;
      state.lastResponseStatus.success.isRequestResult = true;
    });
    builder.addCase(getAccessedPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.loading = false;
      state.accessedPhotos = action.payload;
      state.areAccessedPhotosLoaded = true;
      state.lastResponseStatus.success.isRequestResult = true;
    });
    builder.addCase(uploadPhoto.pending, (state) => {
      dropLastResponseStatus(state);
      state.uploading = true;
    });
    builder.addMatcher(
      isAnyOf(getOwnPhotos.pending, getFavoritePhotos.pending, getAccessedPhotos.pending),
      (state) => {
        dropLastResponseStatus(state);
        state.loading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        uploadPhoto.rejected,
        getOwnPhotos.rejected,
        getFavoritePhotos.rejected,
        getAccessedPhotos.rejected
      ),
      (state, action) => {
        state.uploading = false;
        state.loading = false;
        state.lastResponseStatus.error.isRequestResult = true;
        if (action.payload) {
          state.lastResponseStatus.error.message = action.payload.error;
          state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
        }
      }
    );
  },
});

export const { changeApiLoadingStatus } = photoSlice.actions;

export default photoSlice.reducer;
