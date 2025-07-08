import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Async Thunks
export const fetchAccounts = createAsyncThunk(
  "balance/fetchAccounts",
  async () => {
    const response = await authFetch(`${accUrl}/accounts`);
    return await response.json();
  }
);

export const fetchTotalBalance = createAsyncThunk(
  "balance/fetchTotalBalance",
  async () => {
    const response = await authFetch(`${accUrl}/accounts/balance/total`);
    return await response.json();
  }
);

export const addAccount = createAsyncThunk(
  "balance/addAccount",
  async (newAccount, { dispatch, rejectWithValue }) => {
    try {
      const response = await authFetch(`${accUrl}/accounts`, {
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

      const response = await authFetch(
        `${accUrl}/accounts/${updatedAccount.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccount),
        }
      );
      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON
        throw new Error(errorText);
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
      const response = await authFetch(`${accUrl}/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON
        throw new Error(errorText);
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
    newAccount: null,
  },
  reducers: {
    
    clearNewAccount: (state) => {
      state.newAccount = null;
    }
  },
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
      })

      .addCase(addAccount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newAccount = action.payload; // Store the newly added account
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(editAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editAccount.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {  clearNewAccount } = balanceSlice.actions;
export default balanceSlice.reducer;
