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
  async ({ type, account, category, startDate, endDate, sortField, sortOrder }) => {
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

const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999).toISOString();


const historySlice = createSlice({
  name: "history",
  initialState: {
    accountsData: [],
    categoriesData: [],
    entryData: [],
    totalCost: "",
    status: 'idle',
    error: null,
    filters: {
      type: "ALL",
      account: "",
      category: "",
      startDate: firstDay,
      endDate: lastDay,
      sortOrder: "DESC",
      sortField: "dateTime",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      const newFilters = { ...state.filters, ...action.payload };
      if (action.payload.startDate) {
        newFilters.startDate = new Date(
          action.payload.startDate
        ).toISOString();
      }
      if (action.payload.endDate) {
        newFilters.endDate = new Date(action.payload.endDate).toISOString();
      }
      state.filters = newFilters;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsAndCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccountsAndCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accountsData = action.payload.accountsData;
        state.categoriesData = action.payload.categoriesData;
      })
      .addCase(fetchAccountsAndCategories.rejected, (state) => {
        state.status = 'failed';
        state.error = "Failed to fetch accountsData and categoriesData.";
      })
      .addCase(fetchEntryData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEntryData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entryData = action.payload.entryData;
        state.totalCost = action.payload.totalCost;
      })
      .addCase(fetchEntryData.rejected, (state) => {
        state.status = 'failed';
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
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};
