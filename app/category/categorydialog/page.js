"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { addCategory, editCategory } from "@/redux/slices/categorySlice";
import TextField from "@mui/material/TextField";

export default function CategoryDialog({ catId, name, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [catData, setCatData] = useState({
    name: name || "",
  });

  const handleChange = (e) => {
    setCatData({
      ...catData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (catId) {
      dispatch(editCategory({ id: catId, ...catData }));
      onSuccess("Category updated successfully!");
      onClose();
    } else {
      dispatch(addCategory(catData));
      onSuccess("Category added successfully!");
      onClose();
      if (returnTo) {
        router.push(returnTo);
      }
    }
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
      <div className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3">
        <h2 className="text-xl font-semibold mb-5">
          {catId ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              id="outlined-basic"
              label="Category Name"
              variant="outlined"
              name="name"
              value={catData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded "
              placeholder="Enter Category Name"
              required
              sx={sx}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
