import { LatLng } from 'react-native-maps';
import { Photo, User } from '../api/entities';

export type AuthModalState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
export type MapMode = 'MARKER' | 'HEAT';
export type PhotosType = 'OWN' | 'FAVORITE' | 'ACCESS';
export type LocationPickerMapMode = 'VIEW' | 'NEW';
export type ReplaceAnimationType = 'push' | 'pop';

export interface ResponseStatusState {
  success: {
    isRequestResult: boolean;
    message: string;
  };
  error: {
    isRequestResult: boolean;
    message: string;
    isServerError: boolean;
  };
}

export interface LocationPickerMapState {
  markerLatLng: LatLng | null;
  mode: LocationPickerMapMode;
  loading: boolean;
  autoClose: boolean;
  isOpened: boolean;
}
export interface AuthState {
  authModalState: AuthModalState;
  isAuthStatusChecked: boolean;
  modalOffset: number;
  isAuthorized: boolean;
  authScreenReplaceAnimationType: ReplaceAnimationType;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface UserState {
  hasLoadAttempt: boolean;
  userData: User;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface PhotoState {
  ownPhotos: Photo[];
  favoritesPhotos: Photo[];
  accessedPhotos: Photo[];
  areFavoritePhotosLoaded: boolean;
  areAccessedPhotosLoaded: boolean;
  uploading: boolean;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface PhotoCarouselState {
  loadedPhotos: Photo[];
  openedPhotoIndex: number;
  currentlyViewedPhoto: Photo | null;
  carouselMode: PhotosType;
  isCarouselOpened: boolean;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface MapState {
  photoMarkers: Photo[];
  mode: MapMode;
  photosType: PhotosType;
  locationPickerMapState: LocationPickerMapState;
  isFocused: boolean;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}
