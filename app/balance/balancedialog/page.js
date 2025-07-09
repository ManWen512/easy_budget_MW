"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addAccount, editAccount } from "@/redux/slices/balanceSlice";
import TextField from "@mui/material/TextField";
import { showSnackbar } from "@/redux/slices/snackBarSlice";

export default function BalanceDialogPage({ accId, name, onClose }) {
  const dispatch = useDispatch();

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
      <div className="bg-teal-100 p-6 rounded-lg shadow-lg mx-5 w-full sm:w-1/3">
        <h2 className="text-xl font-semibold mb-5">
          {accId ? "Edit Account" : "Add New Account"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              id="outlined-basic"
              label="Account Name"
              variant="outlined"
              name="name"
              value={accData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded "
              placeholder="Enter account name"
              required
              sx={sx}
            />
          </div>

          <div className="flex justify-end gap-3">
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
