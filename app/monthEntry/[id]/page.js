"use client";

import { useEffect, useState } from "react";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { currencySymbol } from "@/app/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntryDetail, deleteEntry, clearEntryDetail } from "@/redux/slices/entryDetailSlice";

const EntryDetailPage = ({ params, triggerSnackbar }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { id } = params; // Get the entry ID from the URL

  const router = useRouter();
  
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const dispatch = useDispatch();
  const { entry, loading } = useSelector((state) => state.entryDetail);

  useEffect(() => {
    if (id) dispatch(fetchEntryDetail(id));

    return () => {
      dispatch(clearEntryDetail()); // Cleanup when unmounting
    };
  }, [id, dispatch]);

  
  const handleDelete = async () => {
    await dispatch(deleteEntry(id));
    router.push(`/monthEntry?triggerSnackbar=${encodeURIComponent("Entry deleted successfully!")}`);
  };

  

  const openConfirmDialog = (accountId) => {
    setAccountToDelete(accountId);
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setAccountToDelete(null);
    setIsChecked(false);
  };
  const toggleCheckbox = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  // Loading state
  if (!entry) {
    return (
      <>
        <div className="flex justify-center items-center h-screen w-screen sm:w-[60vw]">
          <div className="animate-bounce bg-yellow-900 rounded-full h-8 w-4"></div>
          <div className="animate-bounce bg-yellow-900 rounded-full h-6 w-4"></div>
          <div className="animate-bounce bg-yellow-900 rounded-full h-8 w-4"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sm:mx-40 m-5 mt-20 sm:mt-0 p-10 sm:p-20 bg-white rounded-lg shadow-lg">
        <button
          onClick={() => router.back()}
          className="mb-4"
        >
          <BsArrowLeftCircleFill size={30}/>
        </button>
        <h1 className="text-2xl font-bold mb-4">Details</h1>
        <div className="grid grid-cols-2 mb-4 ">
          <div className="text-gray-500 mr-3 flex justify-between">
            Date<div>:</div>
          </div>
          <div>{entry.dateTime}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Category<div>:</div>
          </div>{" "}
          <div>{entry.category.name}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Cost<div>:</div>
          </div>
          <div>
            {" "}
            {currencySymbol}
            {entry.cost}
          </div>
          {/* dollar Sign */}
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Card<div>:</div>
          </div>
          <div>
            {entry.account.name.charAt(0).toUpperCase() +
              entry.account.name.slice(1)}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Status<div>:</div>
          </div>{" "}
          <div
            className={`px-3 py-1 w-full text-center rounded-full text-xs ${
              entry.type === "INCOME"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {entry.type}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Description<div>:</div>
          </div>{" "}
          <div>{entry.description}</div>
        </div>
        <div className="flex justify-end">
          <div>
            <Link
              href={{
                pathname: "/entry/addEditEntry",
                query: {
                  itemId: entry.id,
                  type: entry.type,
                  category: JSON.stringify(entry.category),
                  balance: JSON.stringify(entry.account),
                  cost: entry.cost,
                  dateTime: entry.dateTime,
                  description: entry.description,
                },
              }}
            >
              <button className="ml-5 ">
                <FaPenSquare size={30} />
              </button>
            </Link>
          </div>
          <div>
            <button
              onClick={() => openConfirmDialog(entry.id)}
              className="ml-5"
            >
              <FaTrash size={30} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-yellow-950 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4 font-bold text-white">Delete Card</h2>
            <div className="flex justify-evenly">
              <FaExclamationTriangle className="text-red-500 mr-4" size={40} />
              <div>
                <div className="text-white mb-2">
                  Are you sure you want to delete this entry?
                </div>
              </div>
            </div>
            <div className="flex items-center mb-4 ml-4">
              <input
                type="checkbox"
                id="confirmDelete"
                checked={isChecked}
                onChange={toggleCheckbox}
                className="mr-5"
              />
              <label htmlFor="confirmDelete" className=" text-white">
                I understand the consequences of deleting this Entry.
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-3"
                onClick={() => closeConfirmDialog()}
                type="button"
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  isChecked ? "bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (isChecked) {
                    handleDelete(accountToDelete); // Use the stored account ID to delete
                    closeConfirmDialog(); // Close the confirm dialog after deletion
                  }
                }}
                disabled={!isChecked} // Disable the button if not checked
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EntryDetailPage;
