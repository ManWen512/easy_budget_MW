import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authFetch from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const signinUser = createAsyncThunk(
  "auth/signinUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${accUrl}/auth/signin`, data);
      const token = res.data;
      localStorage.setItem("token", token);
      return { ...res.data, token };
    } catch (error) {
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${accUrl}/auth/signup`, data);
      const token = res.data;
      localStorage.setItem("token", token);
      return { ...res.data, token };
    } catch (error) {
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const response = await authFetch(`${accUrl}/users/user`);
  return await response.json();
});

export const fetchResetData = createAsyncThunk(
  "auth/fetchResetData",
  async () => {
    const response = await authFetch(`${accUrl}/guest/reset-db`);
    return await response.json();
  }
);

export const updateCurrency = createAsyncThunk(
  "auth/updateCurrency",
  async (localCurrency, thunkAPI) => {
    try {
      // 1. Just wait for the update to complete (ignore response)
      await authFetch(`${accUrl}/users/currency?currency=${localCurrency}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      // 2. Force refresh user data - this will update Redux state
      

      // 3. Return nothing since fetchUser handles the state update
      return;
    } catch (error) {
      console.error("Currency update error:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      localStorage.removeItem("token");
    },

    // loadUserFromStorage: (state) => {
    //   state.token = localStorage.getItem("token");

    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Invalid email or password";
        state.errorStatus = action.payload?.status || null;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Email already exit";
        state.errorStatus = action.payload?.status || null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchResetData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResetData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchResetData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCurrency.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCurrency.fulfilled, (state) => {
        state.status = "succeeded";
        // No need to manually update currency - fetchUser already did it
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // This will have the updated currency
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
