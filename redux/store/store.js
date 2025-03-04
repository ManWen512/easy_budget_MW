"use client";

import { configureStore } from "@reduxjs/toolkit";
import balanceReducer from "../slices/balanceSlice";
import homeReducer from "../slices/homeSlice";
import categoryReducer from "../slices/categorySlice";
import entryReducer from "../slices/entrySlice";
import graphReducer from "../slices/graphSlice";

export const store = configureStore({
  reducer: {
    
    home: homeReducer,
    balance: balanceReducer,
    category: categoryReducer,
    entry: entryReducer,
    graph: graphReducer,
  },
});
