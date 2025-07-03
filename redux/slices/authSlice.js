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
      const status = error.response.status;
      let message = error.response.data.message;
      if (status === 401) message = "Wrong email or password!";
      return thunkAPI.rejectWithValue({  message });
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${accUrl}/auth/signup`, data);
      return res.data;
    } catch (error) {
      const status = error.response.status;
      let message = error.response.data.message;
      if (status === 409) message = "Email already exists! Please Login";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async () => {
    const response = await authFetch(`${accUrl}/users/user`);
    return await response.json();
  }
);

export const fetchResetData = createAsyncThunk(
  "auth/fetchResetData",
  async () => {
    const response = await authFetch(`${accUrl}/guest/reset-db`);
    return await response.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = "idle";
      localStorage.removeItem("token");
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("token");
      if (token) state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Request failed";
        state.errorStatus = action.payload?.status || null;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Request failed";
        state.errorStatus = action.payload?.status || null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
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
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
