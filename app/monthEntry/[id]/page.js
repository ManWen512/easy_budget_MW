"use client";

import { useEffect, useState } from "react";
import Home from "../../page"; // Adjust the path as necessary
import { FaPenSquare, FaTrash } from "react-icons/fa";

const EntryDetailPage = ({ params }) => {
  const { id } = params; // Get the entry ID from the URL
  const [entry, setEntry] = useState(null);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry`;

  // Fetch the entry details based on the ID
  const fetchEntryDetails = async (entryId) => {
    const response = await fetch(`${mainUrl}?id=${entryId}`);
    if (response.ok) {
      const data = await response.json();
      setEntry(data);
    } else {
      console.error("Entry not found");
    }
  };

  useEffect(() => {
    if (id) {
      // Check if id is available
      fetchEntryDetails(id);
    }
  }, [id]);

  // Loading state
  if (!entry) {
    return (
      <Home>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-bounce bg-yellow-900 rounded-full h-8 w-4"></div>
          <div className="animate-bounce bg-yellow-900 rounded-full h-6 w-4"></div>
          <div className="animate-bounce bg-yellow-900 rounded-full h-8 w-4"></div>
        </div>
      </Home>
    );
  }

  return (
    <Home>
      <div className="mx-40 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Details</h1>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Date:</div>
          <div>{entry.dateTime}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Category:</div>{" "}
          <div>{entry.category.name}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Cost:</div>
          <div> ${entry.cost}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Card:</div>
          <div>
            {entry.account.name.charAt(0).toUpperCase() +
              entry.account.name.slice(1)}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Status:</div>{" "}
          <div
            className={`px-3 py-1 w-1/4 text-center rounded-full text-xs ${
              entry.type === "INCOME"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {entry.type}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500">Description:</div>{" "}
          <div>{entry.description}</div>
        </div>
        <div className="flex justify-end">
          <div>
            <button onClick={() => {}} className="ml-5 ">
              <FaPenSquare size={30} />
            </button>
          </div>
          <div>
            <button
              onClick={() => {}}
              className="ml-5"
            >
              <FaTrash size={30} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </Home>
  );
};

export default EntryDetailPage;
