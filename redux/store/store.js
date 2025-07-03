"use client";

import { configureStore } from "@reduxjs/toolkit";
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

export const store = configureStore({
  reducer: {
    
    home: homeReducer,
    balance: balanceReducer,
    category: categoryReducer,
    entry: entryReducer,
    graph: graphReducer,
    monthEntry: monthEntryReducer,
    entryDetail: entryDetailReducer,
    history: historyReducer,
    snackbar: snackbarReducer,
    auth: authReducer,
  },
});
