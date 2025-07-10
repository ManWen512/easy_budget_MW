import { createSlice } from "@reduxjs/toolkit";

const applyThemeClass = (theme) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    currency: "$",
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
});

export const { setCurrency, setTheme, initializeTheme } = settingSlice.actions;
export default settingSlice.reducer;
