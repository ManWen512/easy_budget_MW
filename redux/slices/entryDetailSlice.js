import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Async thunk to fetch entry details by ID
export const fetchEntryDetail = createAsyncThunk(
  "entryDetail/fetchEntryDetail",
  async (id) => {
    const response = await fetch(`${mainUrl}/entry?id=${id}`);
    if (!response.ok) throw new Error("Failed to fetch entry");

    return await response.json(); 
  }
);

export const deleteEntry = createAsyncThunk(
  "entryDetail/deleteEntry",
  async (id, { rejectWithValue }) => {
    const response = await fetch(`${mainUrl}/entry?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) return rejectWithValue("Failed to delete entry");
    return id; // Returning ID to update Redux state
  }
);

const entryDetailSlice = createSlice({
  name: "entryDetail",
  initialState: {
    entry: null,
    status: "idle",
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEntryDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entry = action.payload;
      })
      .addCase(fetchEntryDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteEntry.fulfilled, (state) => {
        state.status = "succeeded";
        state.entry = null; // Reset state after deletion
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearEntryDetail } = entryDetailSlice.actions;
export default entryDetailSlice.reducer;
