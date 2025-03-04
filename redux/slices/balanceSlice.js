import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Async Thunks
export const fetchAccounts = createAsyncThunk(
  "balance/fetchAccounts",
  async () => {
    const response = await fetch(`${accUrl}/account/all`);
    return await response.json();
  }
);

export const fetchTotalBalance = createAsyncThunk(
  "balance/fetchTotalBalance",
  async () => {
    const response = await fetch(`${accUrl}/account/totalBalance`);
    return await response.json();
  }
);

export const addAccount = createAsyncThunk(
    "balance/addAccount",
    async (newAccount, { dispatch, rejectWithValue }) => {
      try {
        const response = await fetch(`${accUrl}/account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAccount),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add account");
        }
  
        dispatch(fetchAccounts());
        dispatch(fetchTotalBalance());
  
        return await response.json(); // Return response if needed
      } catch (error) {
        return rejectWithValue(error.message); // Send error message to Redux state
      }
    }
  );
  
  export const editAccount = createAsyncThunk(
    "balance/editAccount",
    async (updatedAccount, { dispatch, rejectWithValue }) => {
      try {
        if (!updatedAccount.id) {
          throw new Error("Account ID is required for editing.");
        }
  
        const response = await fetch(`${accUrl}/account?id=${updatedAccount.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccount),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update account");
        }
  
        dispatch(fetchAccounts());
        dispatch(fetchTotalBalance());
  
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const deleteAccount = createAsyncThunk(
    "balance/deleteAccount",
    async (accountId, { dispatch, rejectWithValue }) => {
      try {
        const response = await fetch(`${accUrl}/account?id=${accountId}`, { method: "DELETE" });
  
        if (!response.ok) {
          throw new Error("Failed to delete account");
        }
  
        dispatch(fetchAccounts());
        dispatch(fetchTotalBalance());
  
        return accountId; // Return deleted account ID if needed
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    accounts: [],
    totalBalance: 0,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTotalBalance.fulfilled, (state, action) => {
        state.totalBalance = action.payload;
      });
  },
});

export default balanceSlice.reducer;
