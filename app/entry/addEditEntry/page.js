"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { currencySymbol } from "@/app/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchAccounts } from "@/redux/slices/balanceSlice";
import { submitEntry, clearStatus, clearEditEntry } from "@/redux/slices/entrySlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { selectCategories as selectCategoryList } from "@/redux/selectors/categorySelectors";
import { selectAccounts as selectAccountList } from "@/redux/selectors/balanceSelectors";
import {
  selectStatus as selectEntryStatus,
  selectError as selectEntryError,
  selectSuccessMessage,
} from "@/redux/selectors/entrySelectors";

export default function AddEditEntryPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("itemId");
  const categories = useSelector(selectCategoryList);
  const accounts = useSelector(selectAccountList);
  const status = useSelector(selectEntryStatus);
  const error = useSelector(selectEntryError);
  const successMessage = useSelector(selectSuccessMessage);
  const editEntry = useSelector((state) => state.entry.editEntry);

  const router = useRouter();

  // Parse category/account if present in editEntry
  const parsedCategory = editEntry.category ? (typeof editEntry.category === 'string' ? JSON.parse(editEntry.category) : editEntry.category) : null;
  const parsedAccount = editEntry.balance ? (typeof editEntry.balance === 'string' ? JSON.parse(editEntry.balance) : editEntry.balance) : null;
  const localDate = new Date();
  const localDateTime = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  // Initialize formData from editEntry or defaults
  const [formData, setFormData] = useState({
    type: editEntry.type || "OUTCOME",
    categoryId: parsedCategory?.id || "",
    accountId: parsedAccount?.id || "",
    cost: editEntry.cost || 1,
    dateTime: editEntry.dateTime
      ? new Date(editEntry.dateTime)
      : localDate || localDateTime,
    description: editEntry.description || "",
  });


  // Memoize categories and accounts for rendering
  const memoCategories = useMemo(() => categories, [categories]);
  const memoAccounts = useMemo(() => accounts, [accounts]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories()).then((result) => {
      if (result.payload?.length > 0 && formData.categoryId === 0) {
        setDefaultCategory(result.payload);
      }
    });

    dispatch(fetchAccounts()).then((result) => {
      if (result.payload?.length > 0 && formData.accountId === 0) {
        setDefaultAccount(result.payload);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  useEffect(() => {
    if (!itemId) {
      dispatch(clearEditEntry());
    }
  }, [itemId, dispatch]);

  const setDefaultCategory = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      categoryId: data[0].id,
    }));
  };

  const setDefaultAccount = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      accountId: data[0].id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitEntry({ itemId: editEntry.itemId, formData }));
    console.log(formData.dateTime)
  };

  useEffect(() => {
    if (successMessage) {
      router.push("/monthEntry");
      dispatch(showSnackbar({ message: successMessage, severity: "success" }));
      dispatch(clearStatus()); // Reset state after redirection
    }
  }, [successMessage, router, dispatch]);


  
  //new handleDateTimeChange because the MUI datepicker doesnt send in string
  const handleDateTimeChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: newDate,
    }));
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      const selectedCategory = memoCategories.find(
        (cat) => cat.id === parseInt(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        categoryId: selectedCategory?.id || 0,
      }));
    } else if (name === "account") {
      const selectedAccount = memoAccounts.find(
        (acc) => acc.id === parseInt(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        accountId: selectedAccount?.id || 0,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearEditEntry());
    };
  }, [dispatch]);

  return (
    <div className="p-5 mt-14 sm:mt-0">
      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="text-3xl mb-2 flex font-bold justify-center content-center">
            {itemId ? "Edit Entry" : "Create New Entry"}
          </h1>
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 w-full max-w-lg p-5"
            >
              <div className="items-center">
                <div className="mr-5 mb-2 font-bold">Finance Type: </div>
                <div className="flex">
                  <label
                    className={`w-full relative font-bold cursor-pointer p-3 border rounded-lg transition-all ${
                      formData.type === "OUTCOME"
                        ? "border-l-4 border-teal-500 bg-teal-100"
                        : "border-teal-500"
                    }`}
                  >
                    Outcome
                    <input
                      type="radio"
                      id="outcome"
                      name="type"
                      value="OUTCOME"
                      className="sr-only peer"
                      onChange={handleChange}
                      checked={formData.type === "OUTCOME"}
                    />
                  </label>
                  <label
                    className={`ml-3 w-full font-bold  relative cursor-pointer p-3 border rounded-lg transition-all ${
                      formData.type === "INCOME"
                        ? "border-l-4 border-teal-500 bg-teal-100"
                        : "border-teal-500"
                    }`}
                  >
                    Income
                    <input
                      type="radio"
                      id="income"
                      name="type"
                      value="INCOME"
                      className="sr-only peer"
                      onChange={handleChange}
                      checked={formData.type === "INCOME"}
                    />
                  </label>
                </div>
              </div>

              <div className="items-center">
                <div className="grid grid-cols-3 gap-4">
                  <FormControl
                    className="w-full p-3 rounded-md col-span-2"
                    fullWidth
                  >
                    <InputLabel
                      id="demo-simple-select-autowidth-label"
                      className="font-bold"
                    >
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formData.categoryId}
                      onChange={handleChange}
                      autoWidth
                      label="Category"
                      name="category"
                    >
                      {memoCategories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        `/category?showAddNew=true&returnTo=${encodeURIComponent(
                          "/entry/addEditEntry"
                        )}`
                      );
                    }}
                    className="w-full p-3 rounded-md bg-orange-400 font-bold text-sm"
                  >
                    Add New
                  </button>
                </div>
              </div>

              <div className="items-center">
                <div className="grid grid-cols-3 gap-4">
                  <FormControl
                    className="w-full p-3 rounded-md col-span-2"
                    fullWidth
                  >
                    <InputLabel
                      id="demo-simple-select-autowidth-label"
                      className="font-bold"
                    >
                      Account
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={formData.accountId}
                      onChange={handleChange}
                      autoWidth
                      label="Account"
                      name="account"
                    >
                      {memoAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        `/balance?showAddNew=true&returnTo=${encodeURIComponent(
                          "/entry/addEditEntry"
                        )}`
                      );
                    }}
                    className="w-full p-3 rounded-md bg-orange-400 font-bold text-sm"
                  >
                    Add New
                  </button>
                </div>
              </div>

              <div className="items-center">
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    className="w-full  rounded-md relative"
                    min="1"
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        {currencySymbol}
                      </InputAdornment>
                    }
                    label="Amount"
                  />
                </FormControl>
              </div>

              <div className="items-center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    className="w-full p-3 border rounded-md  focus:outline-none"
                    type="datetime-local"
                    id="dateTime"
                    label=" Date Time "
                    name="dateTime"
                    value={formData.dateTime}
                    required
                    onChange={handleDateTimeChange}
                  />
                </LocalizationProvider>
              </div>

              <div className="items-center">
                <TextField
                  id="outlined-multiline-flexible"
                  label="Description"
                  multiline
                  maxRows={4}
                  name="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="font-bold rounded px-4 py-2 bg-orange-400 hover:bg-orange-400 mr-2"
                >
                  {status === "loading" ? "...saving" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="font-bold rounded px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
