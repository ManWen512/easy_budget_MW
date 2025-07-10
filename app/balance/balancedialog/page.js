"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAccount, editAccount } from "@/redux/slices/balanceSlice";
import TextField from "@mui/material/TextField";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { selectTheme } from "@/redux/selectors/settingsSelectors";

const darkMuiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1f2937", // Tailwind gray-800
      default: "#111827", // Tailwind gray-900
    },
    text: {
      primary: "#fff",
    },
  },
});

const lightMuiTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function BalanceDialogPage({ accId, name, onClose }) {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [accData, setAccData] = useState({
    name: name || "",
  });

  const handleChange = (e) => {
    setAccData({
      ...accData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accId) {
      dispatch(editAccount({ id: accId, ...accData }));
      dispatch(
        showSnackbar({
          message: "Account updated successfully!",
          severity: "success",
        })
      );
    } else {
      dispatch(addAccount(accData));
      dispatch(
        showSnackbar({
          message: "Account added successfully!",
          severity: "success",
        })
      );
    }
    onClose();
  };

  //border color and text color for input
  const sx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "grey.400", // normal border color
      },
      "&:hover fieldset": {
        borderColor: "grey.600", // hover border color
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000000", // <-- focus border color (your custom color)
      },
    },
    "& label": {
      color: "gray", // default label color
    },
    "& label.Mui-focused": {
      color: "#000000", // focused label color
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#000000", // still keep your focus border color
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" p-6 rounded-lg shadow-lg mx-5 w-full sm:w-1/3  bg-gradient-to-br from-teal-50 to-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black">
        <h2 className="text-xl font-semibold mb-5 dark:text-white">
          {accId ? "Edit Account" : "Add New Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <ThemeProvider
              theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
            >
              <TextField
                id="outlined-basic"
                label="Account Name"
                variant="outlined"
                name="name"
                value={accData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:text-white"
                placeholder="Enter account name"
                required
                sx={sx}
              />
            </ThemeProvider>
          </div>

          <div className="flex justify-end gap-3 dark:text-white">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
