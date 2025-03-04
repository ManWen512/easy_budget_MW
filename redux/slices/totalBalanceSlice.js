"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action to fetch total balance from API
export const fetchTotalBalance = createAsyncThunk(
  "totalBalance/fetchTotalBalance",
  async () => {
    const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${mainUrl}/account/totalBalance`);
    const data = await response.json();
    return data;
  }
);

const totalBalanceSlice = createSlice({
  name: "totalBalance",
  initialState: {
    value: 0,
    status: "idle", // idle | loading | succeeded | failed
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      })
      .addCase(fetchTotalBalance.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default totalBalanceSlice.reducer;
