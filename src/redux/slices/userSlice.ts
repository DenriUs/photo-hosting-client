import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { string } from 'yup/lib/locale';
import { Photo, User } from '../../api/entities';
import {
  addFavoritePhoto,
  updateBackgroundPhoto,
  updateProfilePhoto,
} from '../../api/requests/photo';
import { loadCurrentUserData } from '../../api/requests/user';
import { UserState } from '../types';

const initialState: UserState = {
  hasLoadAttempt: false,
  userData: {
    _id: '',
    login: '',
    email: '',
    profilePhotoUrl: '',
    backgroundPhotoUrl: '',
    favoritePhotoIds: [],
    accessedPhotoIds: [],
  },
  profilePhotoUpdating: false,
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

const dropLastResponseStatus = (state: UserState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addFavoritePhotoId: (state, action: PayloadAction<string>) => {
      state.userData.favoritePhotoIds.push(action.payload);
    },
    removeFavoritePhotoId: (state, action: PayloadAction<string>) => {
      const favoritePhotoIdIndex = state.userData.favoritePhotoIds.indexOf(action.payload);
      if (favoritePhotoIdIndex !== -1) {
        state.userData.favoritePhotoIds.splice(favoritePhotoIdIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCurrentUserData.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.userData = action.payload;
      state.lastResponseStatus.success.isRequestResult = true;
      state.hasLoadAttempt = true;
    });
    builder.addCase(loadCurrentUserData.rejected, (state, action) => {
      state.loading = false;
      state.lastResponseStatus.error.isRequestResult = true;
      if (action.payload) {
        state.lastResponseStatus.error.message = action.payload.error;
        state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
      }
      state.hasLoadAttempt = true;
    });
    builder.addCase(updateProfilePhoto.fulfilled, (state, action: PayloadAction<User>) => {
      state.profilePhotoUpdating = false;
      console.log(state.userData.profilePhotoUrl, action.payload.profilePhotoUrl);
      state.userData.profilePhotoUrl = action.payload.profilePhotoUrl;
    }),
      builder.addCase(updateBackgroundPhoto.fulfilled, (state, action: PayloadAction<User>) => {
        state.profilePhotoUpdating = false;
        console.log(state.userData.backgroundPhotoUrl, action.payload.backgroundPhotoUrl);
        state.userData.backgroundPhotoUrl = action.payload.backgroundPhotoUrl;
      }),
      builder.addCase(addFavoritePhoto.rejected, (state, action) => {
        state.lastResponseStatus.error.isRequestResult = true;
        if (action.payload) {
          state.lastResponseStatus.error.message = action.payload.error;
          state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
        }
        const favoritePhotoIdIndex = state.userData.favoritePhotoIds.indexOf(
          action.payload?.favoritePhotoId || ''
        );
        if (favoritePhotoIdIndex !== -1) {
          state.userData.favoritePhotoIds.splice(favoritePhotoIdIndex, 1);
        }
      });
    builder.addMatcher(
      isAnyOf(updateProfilePhoto.rejected, updateBackgroundPhoto.rejected),
      (state, action) => {
        state.profilePhotoUpdating = false;
        state.lastResponseStatus.error.isRequestResult = true;
        if (action.payload) {
          state.lastResponseStatus.error.message = action.payload.error;
          state.lastResponseStatus.error.isServerError = action.payload.isServerError || false;
        }
        state.hasLoadAttempt = true;
      }
    );
    builder.addMatcher(isAnyOf(loadCurrentUserData.pending), (state) => {
      dropLastResponseStatus(state);
      state.loading = true;
    });
    builder.addMatcher(
      isAnyOf(
        updateProfilePhoto.pending,
        updateBackgroundPhoto.pending,
      ),
      (state) => {
        dropLastResponseStatus(state);
        state.profilePhotoUpdating = true;
      }
    );
  },
});

export const { addFavoritePhotoId, removeFavoritePhotoId } = userSlice.actions;

export default userSlice.reducer;
