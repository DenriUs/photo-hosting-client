import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AuthModalState, AuthState, PhotoState } from '../types';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';
import { Photo } from '../../api/entities';
import { loadCurrentUserOwnPhotos, uploadPhoto } from '../../api/requests/photo';

const initialState: PhotoState = {
  loadedOwnPhotos: [],
  currentPhotoIndex: 0,
  currentlyViewedPhoto: null,
  isCarouselOpened: false,
  api: {
    loading: true,
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
  }
};

const dropLastResponseStatus = (state: PhotoState) => {
  state.api.lastResponseStatus = initialState.api.lastResponseStatus;
}

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    loadPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.loadedOwnPhotos = action.payload;
    },
    openPhotoCarousel: (state, action: PayloadAction<number>) => {
      state.isCarouselOpened = true;
      state.currentPhotoIndex = action.payload;
    },
    closePhotoCarousel: (state) => {
      state.isCarouselOpened = false;
    },
    openPhotoDetails: (state, action: PayloadAction<Photo>) => {
      state.currentlyViewedPhoto = action.payload;
    },
    closePhotoDetails: (state) => {
      state.currentlyViewedPhoto = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.loadedOwnPhotos.push(action.payload);
    });
    builder.addCase(loadCurrentUserOwnPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.loadedOwnPhotos = action.payload;
    });
    builder.addMatcher(isAnyOf(uploadPhoto.pending, loadCurrentUserOwnPhotos.pending), (state) => {
      dropLastResponseStatus(state);
      state.api.loading = true;
    });
    builder.addMatcher(isAnyOf(uploadPhoto.pending, loadCurrentUserOwnPhotos.rejected), (state, action) => {
      state.api.loading = false;
      state.api.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.api.lastResponseStatus.error.message = action.payload.error;
        state.api.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
  },
});

export const {
  loadPhotos,
  openPhotoCarousel,
  closePhotoCarousel,
  openPhotoDetails,
  closePhotoDetails,
} = photoSlice.actions;

export default photoSlice.reducer;
