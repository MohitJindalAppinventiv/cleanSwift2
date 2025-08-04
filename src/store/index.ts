import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import locationSlice from "./slices/locationSlice";
import profileStatus from "./slices/profileStatus";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    location:locationSlice,
    profileStatus:profileStatus
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;