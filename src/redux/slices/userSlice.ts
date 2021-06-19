import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../api/entities';
import { loadCurrentUserData } from '../../api/requests/user';
import { UserState } from '../types';

const initialState: UserState = {
  hasLoadAttempt: false,
  userData: {
    id: '',
    login: '',
    email: '',
  },
  api: {
    loading: false,
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

const dropLastResponseStatus = (state: UserState) => {
  state.api.lastResponseStatus = initialState.api.lastResponseStatus;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(loadCurrentUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.api.loading = false;
      state.userData = action.payload;
      state.api.lastResponseStatus.success.isRequestResult = true;
      state.hasLoadAttempt = true;
    });
    builder.addCase(loadCurrentUserData.rejected, (state, action) => {
      state.api.loading = false;
      state.api.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.api.lastResponseStatus.error.message = action.payload.error;
        state.api.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
      state.hasLoadAttempt = true;
    });
    builder.addCase(loadCurrentUserData.pending, (state) => {
      dropLastResponseStatus(state);
      state.api.loading = true;
    });
  },
});

export const {
} = userSlice.actions;

export default userSlice.reducer;
