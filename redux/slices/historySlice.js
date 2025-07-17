import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch accountsData & CategoriesData
export const fetchAccountsAndCategories = createAsyncThunk(
  "history/fetchAccountsAndCategories",
  async () => {
    const accountsResponse = await authFetch(`${mainUrl}/accounts`);
    const accountsData = await accountsResponse.json();
    const categoriesResponse = await authFetch(`${mainUrl}/categories`);
    const categoriesData = await categoriesResponse.json();
    return { accountsData, categoriesData };
  }
);

// Fetch Entry Data
export const fetchEntryData = createAsyncThunk(
  "history/fetchEntryData",
  async ({
    type,
    account,
    category,
    startDate,
    endDate,
    sortField,
    sortOrder,
  }) => {
    const params = new URLSearchParams();
    if (type && type !== "ALL") params.append("type", type);
    if (account) params.append("accountId", account);
    if (category) params.append("categoryId", category);
    if (startDate) params.append("startDate", formatDate(startDate));
    if (endDate) params.append("endDate", formatDate(endDate));
    if (sortField) params.append("sortField", sortField);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const url = `${mainUrl}/entries/history?${params}`;

    const response = await authFetch(url);
    const data = await response.json();
    return { entryData: data.entries, totalCost: data.totalCost };
  }
);

const today = new Date();
const year = today.getFullYear(); // 2024
const month = today.getMonth(); // 8 (September, 0-indexed)

// First day of current month (e.g., "2024-09-01")
const firstDay = new Date(year, month, 1);
const formattedFirstDay = `${firstDay.getFullYear()}-${String(
  firstDay.getMonth() + 1
).padStart(2, "0")}-${String(firstDay.getDate()).padStart(2, "0")}`;

// Last day of current month (e.g., "2024-09-30")
const lastDay = new Date(year, month + 1, 0);
const formattedLastDay = `${lastDay.getFullYear()}-${String(
  lastDay.getMonth() + 1
).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;


const historySlice = createSlice({
  name: "history",
  initialState: {
    accountsData: [],
    categoriesData: [],
    entryData: [],
    totalCost: "",
    status: "idle",
    error: null,
    filters: {
      type: "ALL",
      account: "",
      category: "",
      startDate: formattedFirstDay,
      endDate: formattedLastDay,
      sortOrder: "DESC",
      sortField: "date",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      const newFilters = { ...state.filters, ...action.payload };
      if (action.payload.startDate) {
        newFilters.startDate = action.payload.startDate;
      }
      if (action.payload.endDate) {
        newFilters.endDate = action.payload.endDate;
      }
      state.filters = newFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsAndCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccountsAndCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accountsData = action.payload.accountsData;
        state.categoriesData = action.payload.categoriesData;
      })
      .addCase(fetchAccountsAndCategories.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to fetch accountsData and categoriesData.";
      })
      .addCase(fetchEntryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entryData = action.payload.entryData;
        state.totalCost = action.payload.totalCost;
      })
      .addCase(fetchEntryData.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to fetch entries.";
      });
  },
});

export const { setFilters } = historySlice.actions;

export default historySlice.reducer;

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
