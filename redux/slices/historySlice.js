import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch accountsData & CategoriesData
export const fetchAccountsAndCategories = createAsyncThunk(
  "history/fetchAccountsAndCategories",
  async () => {
    const accountsResponse = await fetch(`${mainUrl}/account/all`);
    const accountsData = await accountsResponse.json();
    const categoriesResponse = await fetch(`${mainUrl}/category/all`);
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
    if (sortOrder) params.append("sortOrder", sortOrder === "ascending" ? "ASC" : "DESC");

    const url = `${mainUrl}/entry/history?${params}`;

    const response = await fetch(url);
    const data = await response.json();
    return { entryData: data.entries, totalCost: data.totalCost };
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    accountsData: [],
    categoriesData: [],
    entryData: [],
    totalCost: "",
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsAndCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountsAndCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.accountsData = action.payload.accountsData;
        state.categoriesData = action.payload.categoriesData;
      })
      .addCase(fetchAccountsAndCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch accountsData and categoriesData.";
      })
      .addCase(fetchEntryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntryData.fulfilled, (state, action) => {
        state.loading = false;
        state.entryData = action.payload.entryData;
        state.totalCost = action.payload.totalCost;
      })
      .addCase(fetchEntryData.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch entries.";
      });
  },
});

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
