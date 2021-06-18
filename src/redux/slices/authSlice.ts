import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AuthModalState, AuthState } from '../types';
import { loginAccount, registerAccount } from '../../api/requests/authorization';
import { loadCurrentUserData } from '../../api/requests/user';

const initialState: AuthState = {
  authModalState: 'LOGIN',
  isAuthStatusChecked: false,
  modalOffset: 0,
  isAuthorized: false,
  authScreenReplaceAnimationType: 'push',
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
    changeAuthScreenReplaceAnimationType: (state, action: PayloadAction<'push' | 'pop'>) => {
      state.authScreenReplaceAnimationType = action.payload;
    },
    changeModalOffset: (state, action: PayloadAction<number>) => {
      state.modalOffset = action.payload;
    },
    logoutAccount: (state) => {
      state.isAuthorized = false;
      state.authScreenReplaceAnimationType = 'push';
    },
    cleanUpLastResponseStatus: (state) => {
      state.api.lastResponseStatus = initialState.api.lastResponseStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCurrentUserData.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.isAuthorized = true;
      state.isAuthStatusChecked = true;
      state.authScreenReplaceAnimationType = 'pop';
    });
    builder.addCase(loginAccount.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.isAuthorized = true;
      state.authScreenReplaceAnimationType = 'pop';
    });
    builder.addCase(registerAccount.fulfilled, (state) => {
      state.api.loading = false;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.api.lastResponseStatus.success.message = 'Обліковий запис зареєстровано успішно.';
    });
    builder.addCase(loadCurrentUserData.rejected, (state, action) => {
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
      isAnyOf(loadCurrentUserData.pending, loginAccount.pending, registerAccount.pending),
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
