import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationPickerMapMode, LocationPickerMapState, MapState, PhotoCarouselState } from '../types';
import { Photo } from '../../api/entities';
import { State } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { updatePhoto } from '../../api/requests/photo';

const initialState: MapState = {
  photoMarkers: [],
  locationPickerMapState: {
    markerLatLng: null,
    mode: 'VIEW',
    isOpened: false,
  },
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

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    loadMarkers: (state, action: PayloadAction<Photo[]>) => {
      state.photoMarkers = action.payload;
    },
    openLocationPickerMap: (state, action: PayloadAction<LocationPickerMapMode>) => {
      state.locationPickerMapState.mode = action.payload;
      state.locationPickerMapState.isOpened = true;
    },
    closeLocationPickerMap: (state) => {
      state.locationPickerMapState.isOpened = false;
      state.locationPickerMapState.markerLatLng = null;
    },
    setLocationPickerMapMarker: (state, action: PayloadAction<LatLng | null>) => {
      state.locationPickerMapState.markerLatLng = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updatePhoto.fulfilled, (state) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
    });
    builder.addCase(updatePhoto.rejected, (state, action) => {
      state.loading = false;
      state.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.lastResponseStatus.error.message = action.payload.error;
        state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
    builder.addCase(updatePhoto.pending, (state) => {
      state.loading = false;
    });
  }
});

export const {
  loadMarkers,
  openLocationPickerMap,
  closeLocationPickerMap,
  setLocationPickerMapMarker,
} = mapSlice.actions;

export default mapSlice.reducer;
