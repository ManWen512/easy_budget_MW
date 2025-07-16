import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const applyThemeClass = (theme) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// export const updateCurrency = createAsyncThunk(
//   "setting/updateCurrency",
//   async (localCurrency) => {
//     try {
//       const response = await authFetch(
//         `${accUrl}/users/currency?currency=${localCurrency}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedAccount),
//         }
//       );
//     } catch (error) {}
//   }
// );

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    currency: "£",
    theme: "light", // default to 'light'
  },
  status: "idle",
  error: null,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      applyThemeClass(action.payload);
    },
    initializeTheme: (state) => {
      applyThemeClass(state.theme);
    },
  },
  // extraReducers:{

  // }
});

export const { setCurrency, setTheme, initializeTheme } = settingSlice.actions;
export default settingSlice.reducer;
