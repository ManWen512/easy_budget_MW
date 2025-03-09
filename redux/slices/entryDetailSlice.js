import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch entry details by ID
export const fetchEntryDetail = createAsyncThunk(
  "entryDetail/fetchEntryDetail",
  async (id) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry?id=${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch entry");
    return response.json();
  }
);

export const deleteEntry = createAsyncThunk(
  "entryDetail/deleteEntry",
  async (id, { rejectWithValue }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry?id=${id}`,
      { method: "DELETE" }
    );
    if (!response.ok) return rejectWithValue("Failed to delete entry");
    return id; // Returning ID to update Redux state
  }
);

const entryDetailSlice = createSlice({
  name: "entryDetail",
  initialState: {
    entry: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearEntryDetail: (state) => {
      state.entry = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.entry = action.payload;
      })
      .addCase(fetchEntryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteEntry.fulfilled, (state) => {
        state.entry = null; // Reset state after deletion
      });
  },
});

export const { clearEntryDetail } = entryDetailSlice.actions;
export default entryDetailSlice.reducer;
