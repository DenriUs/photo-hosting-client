import { Photo } from "../api/entities";

export type AuthModalState = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

export interface AuthState {
  authModalState: AuthModalState;
  isAuthStatusChecked: boolean;
  modalOffset: number;
  isAuthorized: boolean;
  loading: boolean;
  error: {
    message: string;
    isServerError: boolean;
  };
}

export interface PhotoState {
  loadedOwnPhotos: Photo[];
  currentPhotoIndex: number,
  currentlyViewedPhoto: Photo | null;
  isCarouselOpened: boolean;
}
