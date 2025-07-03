// redux/slices/snackbarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "info", // info, success, warning, error
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      const { message, severity = "info" } = action.payload;
      state.open = true;
      state.message = message;
      state.severity = severity;
    },
    closeSnackbar: (state) => {
      state.open = false;
      state.message = "";
    },
  },
});

export const { showSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
