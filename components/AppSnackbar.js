"use client";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { closeSnackbar } from "@/redux/slices/snackBarSlice";
import React from "react";

// Memoize the component to prevent unnecessary re-renders
const AppSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  return (
    <Snackbar
      open={open}
      onClose={() => dispatch(closeSnackbar())}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => dispatch(closeSnackbar())}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default React.memo(AppSnackbar);