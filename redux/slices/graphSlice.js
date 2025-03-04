import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry/graphs`;

export const fetchMonthData = createAsyncThunk(
  "graph/fetchMonthData",
  async ({ year, month }) => {
    const response = await fetch(`${mainUrl}/month?year=${year}&month=${month}`);
    const data = await response.json();
    return {
      incomeCategoryList: transformData(data.incomeCategoryPercentageList || {}),
      outcomeCategoryList: transformData(data.outcomeCategoryPercentageList || {}),
      incomeList: transformDayData(data.incomeList || {}, year, month),
      outcomeList: transformDayData(data.outcomeList || {}, year, month),
      incomeCategoryCostList: transformCostData(data.incomeCategoryCostList || {}),
      outcomeCategoryCostList: transformCostData(data.outcomeCategoryCostList || {}),
    };
  }
);

export const fetchYearData = createAsyncThunk("graph/fetchYearData", async (year) => {
  const response = await fetch(`${mainUrl}/year?year=${year}`);
  const data = await response.json();
  return {
    incomeCategoryList: transformData(data.incomeCategoryPercentageList || {}),
    outcomeCategoryList: transformData(data.outcomeCategoryPercentageList || {}),
    incomeList: transformMonthData(data.incomeList || {}),
    outcomeList: transformMonthData(data.outcomeList || {}),
    incomeCategoryCostList: transformCostData(data.incomeCategoryCostList || {}),
    outcomeCategoryCostList: transformCostData(data.outcomeCategoryCostList || {}),
  };
});

export const fetchYearRangeData = createAsyncThunk("graph/fetchYearRangeData", async (yearRange) => {
  const response = await fetch(
    `${mainUrl}/years?startYear=${yearRange.startYear}&endYear=${yearRange.endYear}`
  );
  const data = await response.json();
  return {
    incomeCategoryList: transformData(data.incomeCategoryPercentageList || {}),
    outcomeCategoryList: transformData(data.outcomeCategoryPercentageList || {}),
    incomeList: transformYearData(data.incomeList || {}, yearRange.startYear, yearRange.endYear),
    outcomeList: transformYearData(data.outcomeList || {}, yearRange.startYear, yearRange.endYear),
    incomeCategoryCostList: transformCostData(data.incomeCategoryCostList || {}),
    outcomeCategoryCostList: transformCostData(data.outcomeCategoryCostList || {}),
  };
});

const transformCostData = (dataObject) =>
  Object.entries(dataObject).map(([name, total]) => ({ name, total }));

const transformData = (dataObject) =>
  Object.entries(dataObject).map(([name, percentage]) => ({ name, percentage }));

const transformDayData = (dataObject, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    total: dataObject[i + 1] || 0,
  }));
};

const transformMonthData = (dataObject) => {
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" }).toUpperCase()
  );
  return monthNames.map((month) => ({
    day: month,
    total: dataObject[month] || 0,
  }));
};

const transformYearData = (dataObject, startYear, endYear) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { day: year, total: dataObject[year] || 0 };
  });
};

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    selectedOption: "",
    selectedMonth: null,
    selectedYear: null,
    yearRange: { startYear: null, endYear: null },
    incomeCategoryList: [],
    outcomeCategoryList: [],
    incomeList: [],
    outcomeList: [],
    incomeCategoryCostList: [],
    outcomeCategoryCostList: [],
  },
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
      state.selectedMonth = null;
      state.selectedYear = null;
      state.yearRange = { startYear: null, endYear: null };
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    setYearRange: (state, action) => {
      state.yearRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthData.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchYearData.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })
      .addCase(fetchYearRangeData.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export const { setSelectedOption, setSelectedMonth, setSelectedYear, setYearRange } = graphSlice.actions;
export default graphSlice.reducer;
