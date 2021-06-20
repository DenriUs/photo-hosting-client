import { Photo, User } from '../api/entities';

export type AuthModalState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
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
  loadedOwnPhotos: Photo[];
  photoMarkers: Photo[];
  uploading: boolean;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}

export interface PhotoCarouselState {
  loadedPhotos: Photo[];
  openedPhotoIndex: number;
  currentlyViewedPhoto: Photo | null;
  isCarouselOpened: boolean;
  loading: boolean;
  lastResponseStatus: ResponseStatusState;
}
