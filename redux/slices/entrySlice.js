import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Async thunk for submitting an entry
export const submitEntry = createAsyncThunk(
  "entry/submitEntry",
  async ({ itemId, formData }, { rejectWithValue }) => {
    try {
      const method = itemId ? "PUT" : "POST";
      const url = itemId
        ? `${mainUrl}/entries/${itemId}`
        : `${mainUrl}/entries`;

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        
      });

      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON

        throw new Error(errorText);
      }
   
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const entrySlice = createSlice({
  name: "entry",
  initialState: {
    status: "idle",
    error: null,
    successMessage: null,
    editEntry: {
      type: null,
      category: null,
      balance: null,
      cost: null,
      date: new Date().toISOString(),
      description: null,
    },
  },
  reducers: {
    clearStatus: (state) => {
      state.status = "succeeded";
      state.error = null;
      state.successMessage = null;
    },
    setEditEntry: ( state,action)=>{
      const newEditEntry = { ...state.editEntry, ...action.payload };
      state.editEntry = newEditEntry;
    },
    clearEditEntry: (state) => {
      state.editEntry = {
        type: null,
        category: null,
        balance: null,
        cost: null,
        date: new Date().toISOString(),
        description: null,
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitEntry.fulfilled, (state) => {
        state.status = "loading";
        state.successMessage = "Entry submitted successfully!";
      })
      .addCase(submitEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearStatus, setEditEntry, clearEditEntry } = entrySlice.actions;
export default entrySlice.reducer;
