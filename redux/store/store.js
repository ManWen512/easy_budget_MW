"use client";

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import balanceReducer from "../slices/balanceSlice";
import homeReducer from "../slices/homeSlice";
import categoryReducer from "../slices/categorySlice";
import entryReducer from "../slices/entrySlice";
import graphReducer from "../slices/graphSlice";
import monthEntryReducer from "../slices/monthEntrySlice";
import entryDetailReducer from "../slices/entryDetailSlice";
import historyReducer from "../slices/historySlice";
import snackbarReducer from "../slices/snackBarSlice";
import authReducer from "../slices/authSlice";
import settingReducer from "../slices/settingSlice";
import aiChatReducer from "../slices/aiChatSlice";

const persistConfig = {
  key: 'root', // key for the storage
  storage,     // storage engine (localStorage in this case)
  whitelist: ['auth', 'setting'], // specify which reducers to persist (e.g., 'auth' slice)
  // blacklist: ['someNonPersistedSlice'], // optional: specify which reducers NOT to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  balance: balanceReducer,
  category: categoryReducer,
  entry: entryReducer,
  graph: graphReducer,
  monthEntry: monthEntryReducer,
  entryDetail: entryDetailReducer,
  history: historyReducer,
  snackbar: snackbarReducer,
  setting: settingReducer, 
  aiChat: aiChatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization warnings from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER', 'persist/FLUSH'],
      },
    }),
});

export const persistor = persistStore(store);
