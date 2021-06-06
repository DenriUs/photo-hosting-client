import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';
import { AuthModalState, AuthState } from '../types';

const initialState: AuthState = {
  authModalState: 'LOGIN',
  isAuthorized: false,
  loading: false,
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
    logoutAccount: (state) => {
      state.isAuthorized = false;
    },
    cleanErrors: (state) => {
      state.error.message = '';
      state.error.isServerError = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(checkAuthStatus.pending, loginAccount.pending), (state) => {
      state.loading = true;
    });
    builder.addMatcher(isAnyOf(checkAuthStatus.fulfilled, loginAccount.fulfilled), (state) => {
      state.loading = false;
      state.isAuthorized = true;
    });
    builder.addMatcher(
      isAnyOf(checkAuthStatus.rejected, loginAccount.rejected),
      (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error.message = action.payload.error;
          state.error.isServerError = action.payload.isServerError || false;
        }
      }
    );
  },
});

export const { changeAuthModalState, logoutAccount, cleanErrors } = authSlice.actions;

export default authSlice.reducer;
