"use client";

import { useState, useEffect, useRef } from "react";
import { FaSortDown } from "react-icons/fa";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAndCategories,
  fetchEntryData,
} from "@/redux/slices/historySlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Snackbar from "@/components/snackBar";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { accountsData, categoriesData, entryData, totalCost, loading } =
    useSelector((state) => state.history);
  const { entries, error } = useSelector((state) => state.entry);

  // UI State
  const [type, setType] = useState(searchParams.get("type") || "");
  const [account, setAccount] = useState(searchParams.get("account") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    searchParams.get("endDate") || new Date().toISOString().split("T")[0]
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "DESC"
  );
  const [sortField, setSortField] = useState(
    searchParams.get("sortField") || "dateTime"
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    dispatch(fetchAccountsAndCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchEntryData({
        type,
        account,
        category,
        startDate,
        endDate,
        sortField,
        sortOrder,
      })
    );
  }, [
    dispatch,
    type,
    account,
    category,
    startDate,
    endDate,
    sortField,
    sortOrder,
  ]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
  };

  const handleRowClick = (id) => {
    router.prefetch(`/monthEntry/${id}`);
    router.push(`/monthEntry/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteEntry(id));
    setSnackbarMessage("Entry deleted successfully!");
    setShowSnackbar(true);
  };

  const handleShowSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const openConfirmDialog = (entryId) => {
    setEntryToDelete(entryId);
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setEntryToDelete(null);
    setIsChecked(false);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className=" mt-14 p-5">
      <div className="text-3xl font-bold mb-5">History</div>

      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 mb-4">
        {/* Filter Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex bg-orange-400 px-4 py-2 rounded-md z-20 w-full"
          >
            Filter
            <div>
              <FaSortDown className="ml-1" />
            </div>
          </button>

          {/* Filter Dropdown */}

          {showFilterDropdown && (
            <div className="absolute mt-2 w-64 bg-teal-100 border border-gray-900 rounded-md shadow-lg p-4 z-30">
              <div className="mb-4">
                <label className="block mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="ALL">Type</option>
                  <option value="INCOME">Income</option>
                  <option value="OUTCOME">Outcome</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Account</label>
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Account</option>
                  {accountsData.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Category</option>
                  {categoriesData.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Sort Field</label>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="dateTime">DateTime</option>
                  <option value="cost">Cost</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Sort Button */}
        <div className="flex items-center">
          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "ascending" ? "descending" : "ascending"
              )
            }
            className="bg-orange-400 px-4 py-2 rounded-md flex items-center space-x-1 w-full"
          >
            <span>Sort</span>
            <div>
              {sortOrder === "ascending" ? (
                <FaArrowUpShortWide className="ml-1" />
              ) : (
                <FaArrowDownWideShort className="ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Date Range Pickers */}
        <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
          <div className="flex-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md p-2 w-full h-10 bg-orange-400"
            />
          </div>
          <div className="text-sm">To</div>
          <div className="flex-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md p-2 w-full h-10 bg-orange-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="large" />
          </div>
        ) : entryData.length > 0 ? (
          <div className="w-full">
            {/* Mobile card layout for sm screens */}
            <div className="block sm:hidden">
              {entryData.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl shadow  px-3 py-2 mb-3 border border-gray-100 cursor-pointer ${
                    item.type === "INCOME"
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-red-100 hover:bg-red-200"
                  }`}
                  onClick={() => handleRowClick(item.id)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-700">{new Date(item.dateTime).toLocaleDateString()}</span>
                    
                    <span className="text-sm font-bold text-gray-800">{currencySymbol} {item.cost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">{item.category.name}</span>
                    <span className="text-xs text-gray-500">{item.account.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Table layout for md+ screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {entryData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b cursor-pointer ${
                          item.type === "INCOME"
                            ? "bg-green-100 hover:bg-green-200"
                            : "bg-red-100 hover:bg-red-200"
                        }`}
                        onClick={() => handleRowClick(item.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.dateTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {currencySymbol} {item.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/entry/addEditEntry?id=${item.id}`
                                );
                              }}
                            >
                              <FaPenSquare className="text-blue-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openConfirmDialog(item.id);
                              }}
                            >
                              <FaTrash className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No entries found
          </div>
        )}
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl mr-2" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="mb-4">Are you sure you want to delete this entry?</p>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={toggleCheckbox}
                className="mr-2"
              />
              <label>I understand this action cannot be undone</label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeConfirmDialog}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isChecked) {
                    handleDelete(entryToDelete);
                    closeConfirmDialog();
                  }
                }}
                className={`px-4 py-2 rounded ${
                  isChecked ? "bg-red-500 text-white" : "bg-gray-300"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
}
