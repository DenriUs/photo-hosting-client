import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationPickerMapMode, MapMode, MapState, PhotosType } from '../types';
import { Photo } from '../../api/entities';
import { State } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import { updatePhoto } from '../../api/requests/photo';

const initialState: MapState = {
  photoMarkers: [],
  mode: 'MARKER',
  photosType: 'OWN',
  isOptionsOpened: false,
  locationPickerMapState: {
    markerLatLng: null,
    mode: 'VIEW',
    loading: false,
    autoClose: false,
    isOpened: false,
  },
  isFocused: false,
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

const dropLastResponseStatus = (state: MapState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
};

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
    },
    toggleMapFocused: (state, action: PayloadAction<boolean>) => {
      state.isFocused = action.payload;
    },
    toggleLocationPickerMapAutoClosing: (state, action: PayloadAction<boolean>) => {
      state.locationPickerMapState.autoClose = action.payload;
    },
    toggleMapOptions: (state, action: PayloadAction<boolean>) => {
      state.isOptionsOpened = action.payload;
    },
    changeMapMode: (state, action: PayloadAction<MapMode>) => {
      state.mode = action.payload;
    },
    changePhotosType: (state, action: PayloadAction<PhotosType>) => {
      state.photosType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePhoto.fulfilled, (state) => {
      state.locationPickerMapState.loading = false;
      state.locationPickerMapState.autoClose = true;
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
      dropLastResponseStatus(state);
      state.locationPickerMapState.loading = true;
    });
  },
});

export const {
  loadMarkers,
  openLocationPickerMap,
  closeLocationPickerMap,
  setLocationPickerMapMarker,
  toggleMapFocused,
  toggleLocationPickerMapAutoClosing,
  toggleMapOptions,
  changeMapMode,
  changePhotosType,
} = mapSlice.actions;

export default mapSlice.reducer;
