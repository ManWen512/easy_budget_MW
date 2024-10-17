"use client";

import { useState } from "react";

export default function CategoryDialog({ catId, name, balance, onClose, onSuccess }) {
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const [catData, setCatData] = useState({
    name: name || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (catId === undefined) {
        await fetch(`${mainUrl}/category`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(catData),
        });
        onSuccess("Category Added successfully!")
      } else {
        await fetch(`${mainUrl}/category?id=${catId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(catData),
        });
        onSuccess("Category updated successfully!")
      }
      onClose(); // Close dialog after save
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCatData((prevcatData) => ({
      ...prevcatData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-teal-100 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">
          {catId ? "Edit Category" : "Add New Category"} {/* Conditional title */}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 ">Category Name</label>
            <input
              type="text"
              name="name"
              value={catData.name}
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
              className="bg-teal-400  px-5 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
