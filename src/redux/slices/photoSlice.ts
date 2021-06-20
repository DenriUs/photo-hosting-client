import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { PhotoState } from '../types';
import { Photo } from '../../api/entities';
import { loadCurrentUserOwnPhotos, uploadPhoto } from '../../api/requests/photo';

const initialState: PhotoState = {
  loadedOwnPhotos: [],
  photoMarkers: [],
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
}

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    loadMarkers: (state, action: PayloadAction<Photo[]>) => {
      state.photoMarkers = action.payload;
    },
    changeApiLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
      state.uploading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      state.loadedOwnPhotos.push(action.payload);
    });
    builder.addCase(loadCurrentUserOwnPhotos.fulfilled, (state, action: PayloadAction<Photo[]>) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
      state.loadedOwnPhotos = action.payload;
    });
    builder.addCase(uploadPhoto.pending, (state) => {
      dropLastResponseStatus(state);
      state.uploading = true;
    });
    builder.addCase(loadCurrentUserOwnPhotos.pending, (state) => {
      dropLastResponseStatus(state);
      state.loading = true;
    });
    builder.addMatcher(isAnyOf(uploadPhoto.rejected, loadCurrentUserOwnPhotos.rejected), (state, action) => {
      state.uploading = false;
      state.loading = false;
      state.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.lastResponseStatus.error.message = action.payload.error;
        state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
  },
});

export const {
  loadMarkers,
  changeApiLoadingStatus,
} = photoSlice.actions;

export default photoSlice.reducer;
