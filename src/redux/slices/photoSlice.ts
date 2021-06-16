import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AuthModalState, AuthState, PhotoState } from '../types';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';
import { Photo } from '../../api/entities';

const initialState: PhotoState = {
  loadedOwnPhotos: [],
  currentPhotoIndex: 0,
  currentlyViewedPhoto: null,
  isCarouselOpened: false,
};

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
