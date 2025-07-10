import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entries/graphs`;

export const fetchMonthData = createAsyncThunk(
  "graph/fetchMonthData",
  async ({ year, month }) => {
    const response = await authFetch(
      `${mainUrl}/month?year=${year}&month=${month}`
    );
    const data = await response.json();
    console.log(data);

    return {
      incomeCategoryList: transformData(
        data.incomeCategoryPercentageList || {}
      ),
      outcomeCategoryList: transformData(
        data.outcomeCategoryPercentageList || {}
      ),
      incomeList: transformDayData(data.incomeList || {}, year, month),
      outcomeList: transformDayData(data.outcomeList || {}, year, month),
      incomeCategoryCostList: transformCostData(
        data.incomeCategoryCostList || {}
      ),
      outcomeCategoryCostList: transformCostData(
        data.outcomeCategoryCostList || {}
      ),
    };
  }
);

export const fetchYearData = createAsyncThunk(
  "graph/fetchYearData",
  async (year) => {
    const response = await authFetch(`${mainUrl}/year?year=${year}`);
    const data = await response.json();
    return {
      incomeCategoryList: transformData(
        data.incomeCategoryPercentageList || {}
      ),
      outcomeCategoryList: transformData(
        data.outcomeCategoryPercentageList || {}
      ),
      incomeList: transformMonthData(data.incomeList || {}),
      outcomeList: transformMonthData(data.outcomeList || {}),
      incomeCategoryCostList: transformCostData(
        data.incomeCategoryCostList || {}
      ),
      outcomeCategoryCostList: transformCostData(
        data.outcomeCategoryCostList || {}
      ),
    };
  }
);

export const fetchYearRangeData = createAsyncThunk(
  "graph/fetchYearRangeData",
  async (yearRange) => {
    const response = await authFetch(
      `${mainUrl}/years?startYear=${yearRange.startYear}&endYear=${yearRange.endYear}`
    );
    const data = await response.json();
    return {
      incomeCategoryList: transformData(
        data.incomeCategoryPercentageList || {}
      ),
      outcomeCategoryList: transformData(
        data.outcomeCategoryPercentageList || {}
      ),
      incomeList: transformYearData(
        data.incomeList || {},
        yearRange.startYear,
        yearRange.endYear
      ),
      outcomeList: transformYearData(
        data.outcomeList || {},
        yearRange.startYear,
        yearRange.endYear
      ),
      incomeCategoryCostList: transformCostData(
        data.incomeCategoryCostList || {}
      ),
      outcomeCategoryCostList: transformCostData(
        data.outcomeCategoryCostList || {}
      ),
    };
  }
);

const transformCostData = (dataObject) =>
  Object.entries(dataObject).map(([name, total]) => ({ name, total }));

const transformData = (dataObject) =>
  Object.entries(dataObject).map(([name, percentage]) => ({
    name,
    percentage,
  }));

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
  const yearsArray = [];

  // Iterate through the range of years from startYear to endYear
  for (let year = startYear; year <= endYear; year++) {
    const total = dataObject[year] || 0; // Get total for year or default to 0
    yearsArray.push({ day: year, total }); // Push into the array
  }

  return yearsArray;
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    incomeCategoryList: [],
    outcomeCategoryList: [],
    incomeList: [],
    outcomeList: [],
    incomeCategoryCostList: [],
    outcomeCategoryCostList: [],
    selected: {
      selectedOption: "month",
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      selectedYearRange: {
        startYear:null,
        endYear:null,
      },
    },
    status: "idle",
    error: null,
  },
  reducers: {
    setSelected:(state, action)=>{
      const newSelected = { ...state.selected, ...action.payload };
      state.selected = newSelected;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMonthData.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchMonthData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchYearData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchYearData.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchYearData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchYearRangeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchYearRangeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchYearRangeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedOption,
  setSelectedMonth,
  setSelectedYear,
  setYearRange,
  setSelected,
} = graphSlice.actions;
export default graphSlice.reducer;
