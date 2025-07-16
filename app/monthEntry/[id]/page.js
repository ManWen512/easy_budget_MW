"use client";

import { useEffect, useState } from "react";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { selectCurrency } from "@/redux/selectors/settingsSelectors";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEntryDetail,
  deleteEntry,
  clearEntryDetail,
} from "@/redux/slices/entryDetailSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { setEditEntry } from "@/redux/slices/entrySlice";

const EntryDetailPage = ({ params }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { id } = params;
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState(false);
  const dispatch = useDispatch();

  const { entry, status, error } = useSelector((state) => state.entryDetail);
  const currencySymbol = useSelector(selectCurrency);
  // const { open, message, severity } = useSelector((state) => state.snackbar);

  useEffect(() => {
    if (id) {
      dispatch(fetchEntryDetail(id));
    }
    return () => {
      dispatch(clearEntryDetail());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  const handleDelete = () => {
    if (isChecked) {
      dispatch(deleteEntry(id));

      router.push("/monthEntry");
      dispatch(
        showSnackbar({
          message: "Entry deleted successfully!",
          severity: "success",
        })
      );
    }
  };

  const openConfirmDialog = () => {
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setIsChecked(false);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleEditEntry = () => {
    dispatch(
      setEditEntry({
        type: entry.type,
        category: JSON.stringify(entry.categoryDto),
        balance: JSON.stringify(entry.accountDto),
        cost: entry.cost,
        date: new Date(entry.date).toLocaleString(),
        description: entry.description,
      })
    );
    router.push(`/entry/addEditEntry?itemId=${entry.id}`);
  };

  if (status === "loading") return <LoadingSpinner />;

  if (!entry) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No entry found</div>
      </div>
    );
  }

  return (
    <div className="month-entry-page p-5 w-full ">
      <div className="sm:mx-10 dark:text-gray-200  m-5 mt-16 sm:mt-0 p-6 sm:p-20 bg-gradient-to-br from-teal-50 to-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black rounded-lg shadow-lg ">
        <button onClick={() => router.back()} className="mb-4">
          <BsArrowLeftCircleFill size={30} className="dark:text-white"/>
        </button>

        <h1 className="text-2xl font-bold mb-4 dark:text-white">Details</h1>
        <div className="grid grid-cols-2 mb-4 ">
          <div className="text-gray-500  mr-3 flex justify-between">
            Date<div>:</div>
          </div>
          <div>
            {entry.date
              ? new Date(entry.date).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                })
              : "N/A"}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Category<div>:</div>
          </div>
          <div>{entry.categoryDto?.name || "N/A"}</div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Cost<div>:</div>
          </div>
          <div>
            {currencySymbol} {entry.cost || "N/A"}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Card<div>:</div>
          </div>
          <div>
            {entry.accountDto?.name
              ? entry.accountDto.name.charAt(0).toUpperCase() +
                entry.accountDto.name.slice(1)
              : "N/A"}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Status<div>:</div>
          </div>
          <div
            className={`px-3 py-1 w-full text-center rounded-full text-xs ${
              entry.type === "INCOME"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {entry.type || "N/A"}
          </div>
        </div>
        <div className="grid grid-cols-2 mb-4">
          <div className="text-gray-500 mr-3 flex justify-between">
            Description<div>:</div>
          </div>
          <div>{entry.description || "N/A"}</div>
        </div>
        <div className="flex justify-end">
          <div>
            {/* <Link
              href={{
                pathname: "/entry/addEditEntry",
                query: {
                  itemId: entry.id,
                  type: entry.type,
                  category: JSON.stringify(entry.categoryDto),
                  balance: JSON.stringify(entry.accountDto),
                  cost: entry.cost,
                  dateTime: entry.dateTime,
                  description: entry.description,
                },
              }}
            > */}

            <button className="ml-5" onClick={handleEditEntry}>
              <FaPenSquare size={30} />
            </button>
          </div>
          <div>
            <button onClick={openConfirmDialog} className="ml-5">
              <FaTrash size={30} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
          <div className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3">
            <h2 className="text-2xl mb-4 font-bold">Delete Entry</h2>
            <div className="flex justify-evenly">
              <FaExclamationTriangle className="text-red-500 mr-4" size={40} />
              <div>
                <div className="mb-2">
                  Are you sure you want to delete this entry?
                </div>
                <div className="font-bold mb-2">
                  This action cannot be undone!
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
                autoComplete="off"
              />
              <label htmlFor="confirmDelete">
                I understand the consequences of deleting this entry.
              </label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeConfirmDialog}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors mr-3"
              >
                Close
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded transition-colors ${
                  isChecked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300"
                }`}
                disabled={!isChecked}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryDetailPage;
