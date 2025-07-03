"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { FaSortDown } from "react-icons/fa";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccountsAndCategories,
  fetchEntryData,
  setFilters,
} from "@/redux/slices/historySlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { showSnackbar, closeSnackbar } from "@/redux/slices/snackBarSlice";
import {
  selectAccountsData,
  selectCategoriesData,
  selectEntryData,
  selectTotalCost,
  selectStatus,
  selectError,
  selectFilters,
} from "@/redux/selectors/historySelectors";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const accountsData = useSelector(selectAccountsData);
  const categoriesData = useSelector(selectCategoriesData);
  const entryData = useSelector(selectEntryData);
  const totalCost = useSelector(selectTotalCost);
  const status = useSelector(selectStatus);
  const filters = useSelector(selectFilters);
  const error = useSelector(selectError);

  // UI State

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAccountsAndCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEntryData(filters));
    }
  }, [dispatch, filters, status]);

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

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error]);

  // Memoize entryData for table rendering
  const memoEntryData = useMemo(() => entryData, [entryData]);

  const handleSort = () => {
    const newSortOrder = filters.sortOrder === "DESC" ? "ASC" : "DESC";
    dispatch(setFilters({ sortOrder: newSortOrder }));
  };

  const handleEditClick = (item) => {
    const { id, type, category, account } = item;
    const params = new URLSearchParams({
      itemId: id,
      type,
      category: JSON.stringify(category),
      balance: JSON.stringify(account),
      cost: item.cost,
      dateTime: item.dateTime,
      description: item.description,
    });
    router.push(`/entry/addEditEntry?${params.toString()}`);
  };

  const handleRowClick = (item) => {
    router.prefetch(`/monthEntry/${item.id}`);
    router.push(`/monthEntry/${item.id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteEntry(id));
    dispatch(
      showSnackbar({
        message: "Entry deleted successfully!",
        severity: "",
      })
    );
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

      <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:space-x-4 mb-4">
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
              <FormControl className="w-full p-3 rounded-md mb-4">
                <InputLabel
                  id="demo-simple-select-autowidth-label"
                  className="font-bold"
                >
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={filters.type || ""}
                  onChange={(e) =>
                    dispatch(setFilters({ ...filters, type: e.target.value }))
                  }
                  autoWidth
                  label="Type"
                  name="type"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="INCOME">Income</MenuItem>
                  <MenuItem value="OUTCOME">Outcome</MenuItem>
                </Select>
              </FormControl>

              <div className="mb-4"></div>
              <FormControl className="w-full p-3 rounded-md mb-4">
                <InputLabel
                  id="demo-simple-select-autowidth-label"
                  className="font-bold"
                >
                  Account
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={filters.account || ""}
                  onChange={(e) =>
                    dispatch(
                      setFilters({ ...filters, account: e.target.value })
                    )
                  }
                  autoWidth
                  label="Account"
                  name="account"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MenuItem value="">All</MenuItem>
                  {accountsData.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mb-4"></div>

              <FormControl className="w-full p-3 rounded-md mb-4">
                <InputLabel
                  id="demo-simple-select-autowidth-label"
                  className="font-bold"
                >
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={filters.category || ""}
                  onChange={(e) =>
                    dispatch(
                      setFilters({ ...filters, category: e.target.value })
                    )
                  }
                  autoWidth
                  label="Category"
                  name="category"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MenuItem value="">All</MenuItem>
                  {categoriesData.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="mb-4"></div>

              <FormControl className="w-full p-3 rounded-md mb-4">
                <InputLabel
                  id="demo-simple-select-autowidth-label"
                  className="font-bold"
                >
                  Sort Field
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={filters.sortField || ""}
                  onChange={(e) =>
                    dispatch(
                      setFilters({ ...filters, sortField: e.target.value })
                    )
                  }
                  autoWidth
                  label="Sort Field"
                  name="sortField"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MenuItem value="dateTime">DateTime</MenuItem>
                  <MenuItem value="cost">Cost</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </div>

        {/* Sort Button */}
        <div className="flex items-center">
          <button
            onClick={handleSort}
            className="bg-orange-400 px-4 py-2 rounded-md flex items-center space-x-1 w-full"
          >
            <span>Sort</span>
            <div>
              {filters.sortOrder === "DESC" ? (
                <FaArrowDownWideShort className="ml-1" />
              ) : (
                <FaArrowUpShortWide className="ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Date Range Pickers */}
        <div className="col-span-2 sm:col-auto sm:flex-1 flex items-center gap-2">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className="w-full  rounded-md  "
              type="date"
              id="startDate"
              label=" Start Date "
              name="startDate"
              value={new Date(filters.startDate)}
              required
              onChange={(newDate) =>
                dispatch(
                  setFilters({ ...filters, startDate: newDate.toISOString() })
                )
              }
            />
          </LocalizationProvider>
          <div className="text-sm">To</div>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className="w-full  rounded-md  "
              type="date"
              id="endDate"
              label=" End Date "
              name="endDate"
              value={new Date(filters.endDate)}
              required
              onChange={(newDate) =>
                dispatch(
                  setFilters({ ...filters, endDate: newDate.toISOString() })
                )
              }
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="mt-4">
        {status === "loading" ? (
          <LoadingSpinner />
        ) : memoEntryData.length > 0 ? (
          <div className="w-full">
            {/* Mobile card layout for sm screens */}
            <div className="block sm:hidden">
              {memoEntryData.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl shadow  px-3 py-2 mb-3 border border-gray-100 cursor-pointer ${
                    item.type === "INCOME"
                      ? "bg-green-100 hover:bg-green-200"
                      : "bg-red-100 hover:bg-red-200"
                  }`}
                  onClick={() => handleRowClick(item)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-700">
                      {new Date(item.dateTime).toLocaleDateString()}
                    </span>

                    <span className="text-sm font-bold text-gray-800">
                      {currencySymbol} {item.cost}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">
                      {item.category.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.account.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Table layout for md+ screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memoEntryData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b cursor-pointer ${
                        item.type === "INCOME"
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-red-100 hover:bg-red-200"
                      }`}
                      onClick={() => handleRowClick(item)}
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
                              handleEditClick(item);
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
        open={open}
        onClose={() => dispatch(closeSnackbar())}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(closeSnackbar())}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
