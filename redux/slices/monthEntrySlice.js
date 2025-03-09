import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry`;

// Async thunk for fetching month entries
export const fetchMonthEntries = createAsyncThunk(
  "monthEntry/fetchMonthEntries",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${mainUrl}/monthEntry?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const monthEntrySlice = createSlice({
  name: "monthEntry",
  initialState: {
    monthEntries: [],
    totalIncome: 0,
    totalOutcome: 0,
    totalBalance: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    isLoading: false,
    error: null,
    snackbarMessage: "",
    showSnackbar: false,
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setMonth: (state, action) => {
      state.month = action.payload;
    },
    handleMonthChange: (state, action) => {
      if (action.payload === "prev") {
        if (state.month === 1) {
          state.month = 12;
          state.year -= 1;
        } else {
          state.month -= 1;
        }
      } else if (action.payload === "next") {
        if (state.month === 12) {
          state.month = 1;
          state.year += 1;
        } else {
          state.month += 1;
        }
      }
    },
    setSnackbarMessage: (state, action) => {
      state.snackbarMessage = action.payload;
      state.showSnackbar = true;
    },
    clearSnackbar: (state) => {
      state.snackbarMessage = "";
      state.showSnackbar = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monthEntries = action.payload.entries;
        state.totalIncome = action.payload.totalIncome;
        state.totalOutcome = action.payload.totalOutcome;
        state.totalBalance = action.payload.totalBalance;
      })
      .addCase(fetchMonthEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setYear, setMonth, handleMonthChange, setSnackbarMessage, clearSnackbar } = monthEntrySlice.actions;
export default monthEntrySlice.reducer;
