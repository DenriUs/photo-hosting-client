import { Photo, User } from '../api/entities';

export type AuthModalState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

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
  api: ApiState;
}

export interface UserState {
  userData: User,
  api: ApiState;
}

export interface PhotoState {
  loadedOwnPhotos: Photo[];
  currentPhotoIndex: number,
  currentlyViewedPhoto: Photo | null;
  isCarouselOpened: boolean;
  api: ApiState;
}
