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
