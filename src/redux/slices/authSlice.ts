import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AuthModalState, AuthState } from '../types';
import { checkAuthStatus, loginAccount, registerAccount } from '../../api/requests/authorization';

const initialState: AuthState = {
  authModalState: 'LOGIN',
  isAuthStatusChecked: false,
  modalOffset: 0,
  isAuthorized: false,
  api: {
    loading: true,
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
  },
};

const dropLastResponseStatus = (state: AuthState) => {
  state.api.lastResponseStatus = initialState.api.lastResponseStatus;
}

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
    cleanUpLastResponseStatus: (state) => {
      state.api.lastResponseStatus = initialState.api.lastResponseStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuthStatus.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.isAuthorized = true;
      state.isAuthStatusChecked = true;
    });
    builder.addCase(loginAccount.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.isAuthorized = true;
    });
    builder.addCase(registerAccount.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.api.lastResponseStatus.success.message = 'Обліковий запис зареєстровано успішно.';
    });
    builder.addCase(checkAuthStatus.rejected, (state, action) => {
      state.api.loading = false;
      state.isAuthStatusChecked = true;
      state.api.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.api.lastResponseStatus.error.message = action.payload.error;
        state.api.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
    builder.addMatcher(
      isAnyOf(loginAccount.rejected, registerAccount.rejected),
      (state, action) => {
        state.api.loading = false;
        state.api.lastResponseStatus.error.isRequestResult = true;
        if (action.payload) {
          state.api.lastResponseStatus.error.message = action.payload.error;
          state.api.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
        }
      },
    );
    builder.addMatcher(
      isAnyOf(checkAuthStatus.pending, loginAccount.pending, registerAccount.pending),
      (state) => {
        dropLastResponseStatus(state);
        state.api.loading = true;
      },
    );
  },
});

export const {
  changeAuthModalState, 
  changeModalOffset,
  logoutAccount,
  cleanUpLastResponseStatus,
} = authSlice.actions;

export default authSlice.reducer;
