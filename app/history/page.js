"use client";

import { useState, useEffect, useRef } from "react";
import { FaSortDown } from "react-icons/fa";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountsAndCategories, fetchEntryData } from "@/redux/slices/historySlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Snackbar from "@/components/snackBar";
import AnimatedButton from "@/components/AnimatedButton";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { accountsData, categoriesData, entryData, totalCost, loading } = useSelector((state) => state.history);
  const { entries, error } = useSelector((state) => state.entry);

  // UI State
  const [type, setType] = useState(searchParams.get("type") || "");
  const [account, setAccount] = useState(searchParams.get("account") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || new Date().toISOString().split("T")[0]);
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "DESC");
  const [sortField, setSortField] = useState(searchParams.get("sortField") || "dateTime");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAccountsAndCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEntryData({ type, account, category, startDate, endDate, sortField, sortOrder }));
  }, [dispatch, type, account, category, startDate, endDate, sortField, sortOrder]);

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
    <motion.div 
      className="history-page mt-14 p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-3xl font-bold mb-5"
        variants={itemVariants}
      >
        History
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 sm:flex sm:flex-row gap-4 mb-4"
        variants={itemVariants}
      >
        {/* Filter Button */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex bg-orange-400 px-4 py-2 rounded-md z-20 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Filter
            <motion.div
              animate={{ rotate: showFilterDropdown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaSortDown className="ml-1" />
            </motion.div>
          </motion.button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div 
                className="absolute mt-2 w-64 bg-teal-100 border border-gray-900 rounded-md shadow-lg p-4 z-30"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block mb-2">Type</label>
                  <motion.select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="ALL">Type</option>
                    <option value="INCOME">Income</option>
                    <option value="OUTCOME">Outcome</option>
                  </motion.select>
                </motion.div>

                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block mb-2">Account</label>
                  <motion.select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">Account</option>
                    {accountsData.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>

                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block mb-2">Category</label>
                  <motion.select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">Category</option>
                    {categoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </motion.select>
                </motion.div>

                <motion.div 
                  className="mb-4"
                  variants={itemVariants}
                >
                  <label className="block mb-2">Sort Field</label>
                  <motion.select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="dateTime">DateTime</option>
                    <option value="cost">Cost</option>
                  </motion.select>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Button */}
        <motion.div 
          className="flex items-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setSortOrder(sortOrder === "ascending" ? "descending" : "ascending")}
            className="bg-orange-400 px-4 py-2 rounded-md flex items-center space-x-1 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>Sort</span>
            <motion.div
              animate={{ rotate: sortOrder === "ascending" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {sortOrder === "ascending" ? (
                <FaArrowUpShortWide className="ml-1" />
              ) : (
                <FaArrowDownWideShort className="ml-1" />
              )}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Date Range Pickers */}
        <motion.div 
          className="col-span-2 sm:col-span-1 flex items-center gap-2"
          variants={itemVariants}
        >
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md p-2 w-full h-10 bg-orange-400"
            />
          </motion.div>
          <div className="text-sm">To</div>
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md p-2 w-full h-10 bg-orange-400"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-4"
        variants={itemVariants}
      >
        {loading ? (
          <motion.div 
            className="flex justify-center items-center min-h-[60vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner size="large" />
          </motion.div>
        ) : entryData.length > 0 ? (
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {["Date", "Type", "Category", "Cost", "Account", "Actions"].map((header, index) => (
                      <motion.th
                        key={header}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </motion.th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {entryData.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, x: 5 }}
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
                          <motion.div 
                            className="flex space-x-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/entry/addEditEntry?id=${item.id}`);
                              }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaPenSquare className="text-blue-500" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                openConfirmDialog(item.id);
                              }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaTrash className="text-red-500" />
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 text-gray-500"
          >
            No entries found
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            >
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
                <motion.button
                  onClick={closeConfirmDialog}
                  className="px-4 py-2 bg-gray-200 rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (isChecked) {
                      handleDelete(entryToDelete);
                      closeConfirmDialog();
                    }
                  }}
                  className={`px-4 py-2 rounded ${
                    isChecked ? "bg-red-500 text-white" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isChecked}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </motion.div>
  );
}
