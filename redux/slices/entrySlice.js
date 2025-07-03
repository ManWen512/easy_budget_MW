import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Async thunk for submitting an entry
export const submitEntry = createAsyncThunk(
  "entry/submitEntry",
  async ({ itemId, formData }, { rejectWithValue }) => {
    try {
      const method = itemId ? "PUT" : "POST";
      const url = itemId ? `${mainUrl}/entry?id=${itemId}` : `${mainUrl}/entry`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit entry");

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const entrySlice = createSlice({
  name: "entry",
  initialState: {
    status: 'idle',
    error: null,
    successMessage: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.status = 'succeeded';
      state.error = null;
      state.successMessage = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEntry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitEntry.fulfilled, (state) => {
        state.status = 'loading';
        state.successMessage = "Entry submitted successfully!";
      })
      .addCase(submitEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = entrySlice.actions;
export default entrySlice.reducer;
