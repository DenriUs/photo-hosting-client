import { Photo, User } from '../api/entities';

export type AuthModalState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
export type ReplaceAnimationType = 'push' | 'pop';
export type CarouselMode = 'own' | 'marker';

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

export interface ApiState {
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface AuthState {
  authModalState: AuthModalState;
  isAuthStatusChecked: boolean;
  modalOffset: number;
  isAuthorized: boolean;
  authScreenReplaceAnimationType: ReplaceAnimationType;
  api: ApiState;
}

export interface UserState {
  hasLoadAttempt: boolean;
  userData: User;
  api: ApiState;
}

export interface PhotoState {
  loadedOwnPhotos: Photo[];
  photoMarkers: Photo[];
  currentPhotoIndex: number;
  currentlyViewedPhoto: Photo | null;
  isCarouselOpened: boolean;
  carouselMode: CarouselMode;
  api: ApiState;
}
