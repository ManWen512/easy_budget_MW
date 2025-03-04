"use client";

import { useState } from "react";
import Snackbar from "@/components/snackBar";
import { useDispatch } from "react-redux";
import { addAccount, editAccount } from "@/redux/slices/balanceSlice";

export default function BalanceDialogPage({ accId, name, balance, onClose, onSuccess }) {
  const dispatch = useDispatch();
  
  const [accData, setAccData] = useState({
    name: name || "",
    balance: balance || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (accId === undefined) {
      dispatch(addAccount(accData)); // Dispatch Redux action to add a new account
      onSuccess("Account Added successfully!");
    } else {
      dispatch(editAccount({ id: accId, ...accData })); // Dispatch Redux action to edit existing account
      onSuccess("Account Updated successfully!");
    }

    onClose(); // Close dialog after save
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccData((prevaccData) => ({
      ...prevaccData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-teal-100  p-6 rounded-lg shadow-lg sm:w-1/3">
        <h2 className="text-xl  font-semibold mb-4">
          {accId ? "Edit Account" : "Add New Account"} {/* Conditional title */}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 ">Account Name</label>
            <input
              type="text"
              name="name"
              value={accData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter account name"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-teal-400  px-4 py-2 rounded-md mr-3"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-teal-400 px-5 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    
    </div>
  );
}
