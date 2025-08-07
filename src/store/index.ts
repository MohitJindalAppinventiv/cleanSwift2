// import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import locationSlice from "./slices/locationSlice";
import profileStatus from "./slices/profileStatus";
import settingSlice from "./slices/settingsSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authSlice,
//     location:locationSlice,
//     profileStatus:profileStatus,
//     settings:settingSlice
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import couponSlice from "./slices/couponSlice";
// import settingsReducer from "./slices/settingsSlice";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings","coupons"], // Only persist 'settings' slice (which includes profile)
};

const rootReducer = combineReducers({
  settings: settingSlice, // contains profile
      auth: authSlice,
    location:locationSlice,
    profileStatus:profileStatus,
    coupons:couponSlice
  // add other slices here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
