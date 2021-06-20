import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { PhotoCarouselState } from '../types';
import { Photo } from '../../api/entities';
import { uploadPhoto } from '../../api/requests/photo';

const initialState: PhotoCarouselState = {
  loadedPhotos: [],
  openedPhotoIndex: 0,
  currentlyViewedPhoto: null,
  isCarouselOpened: false,
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

const dropLastResponseStatus = (state: PhotoCarouselState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
}

const photoCarouselSlice = createSlice({
  name: 'photoCarousel',
  initialState,
  reducers: {
    loadPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.loadedPhotos = action.payload;
    },
    changeApiLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    changeOpenedPhotoIndex: (state, action: PayloadAction<number>) => {
      state.openedPhotoIndex = action.payload;
    },
    changeCurrentlyViwedPhoto: (state, action: PayloadAction<Photo>) => {
      state.currentlyViewedPhoto = action.payload;
    },
    openPhotoCarousel: (state, action: PayloadAction<number>) => {
      state.isCarouselOpened = true;
      state.openedPhotoIndex = action.payload;
    },
    closePhotoCarousel: (state) => {
      state.isCarouselOpened = false;
      state.openedPhotoIndex = 0;
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
  changeApiLoadingStatus,
  changeOpenedPhotoIndex,
  changeCurrentlyViwedPhoto,
  openPhotoCarousel,
  closePhotoCarousel,
  openPhotoDetails,
  closePhotoDetails,
} = photoCarouselSlice.actions;

export default photoCarouselSlice.reducer;
