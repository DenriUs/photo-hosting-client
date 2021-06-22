import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PhotoCarouselState, PhotosType, ShareWithUsersState } from '../types';
import { User } from '../../api/entities';
import { searchUsersToSharePhoto } from '../../api/requests/user';

const initialState: ShareWithUsersState = {
  userIdToSharePhoto: '',
  searchedUsers: [],
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

const dropLastResponseStatus = (state: PhotoCarouselState) => {
  state.lastResponseStatus = initialState.lastResponseStatus;
}

const shareWithUsersSlice = createSlice({
  name: 'shareWithUsers',
  initialState,
  reducers: {
    addUserIdToShare: (state, action: PayloadAction<string>) => {
      state.userIdToSharePhoto = action.payload;
    },
    clearSearchedUsers: (state) => {
      state.searchedUsers = [];
    },
    removeClickedUser: (state, action: PayloadAction<string>) => {
      const userIndex = state.searchedUsers.findIndex((user) => user._id = action.payload);
      if (userIndex !== -1) {
        state.searchedUsers.splice(userIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchUsersToSharePhoto.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.searchedUsers = action.payload;
    });
  },
});

export const {
  clearSearchedUsers,
  removeClickedUser,
} = shareWithUsersSlice.actions;

export default shareWithUsersSlice.reducer;
