import { combineReducers, configureStore, PayloadAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import photoReducer from './slices/photoSlice';
import photoCarouselReducer from './slices/photoCarouselSlice';
import mapReducer from './slices/mapSlice';
import editUserReducer from './slices/editUserSlice';
import shareWithUsersReducer from './slices/shareWithUsersSlice';
import commentReducer from './slices/commentSlice';

const combinedReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  editUser: editUserReducer,
  photo: photoReducer,
  photoCarousel: photoCarouselReducer,
  shareWithUsers: shareWithUsersReducer,
  map: mapReducer,
  comment: commentReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logoutAccount') {
    state = undefined;
  }
  return combinedReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
