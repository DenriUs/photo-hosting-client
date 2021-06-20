import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import photoReducer from './slices/photoSlice';
import photoCarouselReducer from './slices/photoCarouselSlice';
import mapReducer from './slices/mapSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  photo: photoReducer,
  photoCarousel: photoCarouselReducer,
  map: mapReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
