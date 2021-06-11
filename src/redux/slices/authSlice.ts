import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AuthModalState, AuthState } from '../types';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';

const initialState: AuthState = {
  authModalState: 'LOGIN',
  isAuthStatusChecked: false,
  modalOffset: 0,
  isAuthorized: false,
  loading: true,
  error: {
    message: '',
    isServerError: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAuthModalState: (state, action: PayloadAction<AuthModalState>) => {
      state.authModalState = action.payload;
    },
    changeModalOffset: (state, action: PayloadAction<number>) => {
      state.modalOffset = action.payload;
    },
    logoutAccount: (state) => {
      state.isAuthorized = false;
    },
    cleanErrors: (state) => {
      state.error.message = '';
      state.error.isServerError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuthStatus.fulfilled, (state) => {
      state.loading = false;
      state.isAuthorized = true;
      state.isAuthStatusChecked = true;
    });
    builder.addCase(loginAccount.fulfilled, (state) => {
      state.loading = false;
      state.isAuthorized = true;
    });
    builder.addCase(checkAuthStatus.rejected, (state, action) => {
      state.loading = false;
      state.isAuthStatusChecked = true;
      if (action.payload) {
        state.error.message = action.payload.error;
        state.error.isServerError = action.payload.isServerError || false;
      }
    });
    builder.addCase(loginAccount.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.error.message = action.payload.error;
        state.error.isServerError = action.payload.isServerError || false;
      }
    });
    builder.addMatcher(isAnyOf(checkAuthStatus.pending, loginAccount.pending), (state) => {
      state.loading = true;
    });
  },
});

export const {
  changeAuthModalState, 
  changeModalOffset,
  logoutAccount,
  cleanErrors,
} = authSlice.actions;

export default authSlice.reducer;
