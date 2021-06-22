import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Photo, User } from '../../api/entities';
import { addFavoritePhoto } from '../../api/requests/photo';
import { loadCurrentUserData, updateUser } from '../../api/requests/user';
import { EditUserState, UserState } from '../types';

const initialState: EditUserState = {
  login: '',
  email: '',
  profilePhoto: '',
  backgroundPhoto: '',
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
};

const dropLastResponseStatus = (state: EditUserState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
};

const editUserSlice = createSlice({
  name: 'editUser',
  initialState,
  reducers: {
    pickProfileImage: (state, action: PayloadAction<string>) => {
      state.profilePhoto = action.payload;
    },
    pickBackgroundImage: (state, action: PayloadAction<string>) => {
      state.backgroundPhoto = action.payload;
    },
    cleanUpLastResponseStatus: (state) => {
      dropLastResponseStatus(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state) => {
      state.loading = false;
      state.lastResponseStatus.success.isRequestResult = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.lastResponseStatus.error.message = action.payload.error;
        state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
    });
    builder.addCase(updateUser.pending, (state) => {
      dropLastResponseStatus(state);
      state.loading = true;
    });
  },
});

export const {
  pickProfileImage,
  pickBackgroundImage,
  cleanUpLastResponseStatus,
} = editUserSlice.actions;

export default editUserSlice.reducer;
