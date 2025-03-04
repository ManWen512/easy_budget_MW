import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Thunks for fetching data
export const fetchTotalBalance = createAsyncThunk(
  "home/fetchTotalBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${mainUrl}/account/totalBalance`);
      if (!response.ok) throw new Error("Failed to fetch total balance");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMonthData = createAsyncThunk(
  "home/fetchMonthData",
  async (_, { rejectWithValue }) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const response = await fetch(
        `${mainUrl}/entry/graphs/month?year=${currentYear}&month=${currentMonth}`
      );
      if (!response.ok) throw new Error("Failed to fetch month data");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    totalBalance: 0,
    incomeList: [],
    outcomeList: [],
    incomeCategoryList: [],
    outcomeCategoryList: [],
    incomeCategoryCostList: [],
    outcomeCategoryCostList: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Total Balance
      .addCase(fetchTotalBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalBalance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalBalance = action.payload;
      })
      .addCase(fetchTotalBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Fetch Monthly Data
      .addCase(fetchMonthData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonthData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const data = action.payload;
        state.incomeList = transformDayData(data.incomeList || {});
        state.outcomeList = transformDayData(data.outcomeList || {});
        state.incomeCategoryList = transformData(data.incomeCategoryPercentageList || {});
        state.outcomeCategoryList = transformData(data.outcomeCategoryPercentageList || {});
        state.incomeCategoryCostList = transformCostData(data.incomeCategoryCostList || {});
        state.outcomeCategoryCostList = transformCostData(data.outcomeCategoryCostList || {});
      })
      .addCase(fetchMonthData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default homeSlice.reducer;

// Utility functions for data transformation
const transformCostData = (dataObject) => {
  return Object.entries(dataObject).map(([name, total]) => ({ name, total }));
};

const transformData = (dataObject) => {
  return Object.entries(dataObject).map(([name, percentage]) => ({
    name,
    percentage,
  }));
};

const transformDayData = (dataObject) => {
  const daysInMonth = new Date().getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, total: dataObject[day] || 0 };
  });
};
