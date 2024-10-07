"use client";

import { useState } from "react";
import Snackbar from "@/components/snackBar";

export default function BalanceDialogPage({ accId, name, balance, onClose, onSuccess }) {
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  
  const [accData, setAccData] = useState({
    name: name || "",
    balance: balance || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (accId === undefined) {
        await fetch(`${mainUrl}/account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accData),
        });
        onSuccess("Account Added successfully!")
      } else {
        await fetch(`${mainUrl}/account?id=${accId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accData),
        });
        onSuccess("Account Updated successfully!")

      }
      onClose(); // Close dialog after save

      
    } catch (error) {
      console.error("Error:", error);
     
    }
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
      <div className="bg-yellow-950 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl text-white font-semibold mb-4">
          {accId ? "Edit Account" : "Add New Account"} {/* Conditional title */}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-white">Account Name</label>
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
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-3"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    
    </div>
  );
}
