"use client";

import { useEffect, useState, useMemo } from "react";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import BalanceDialogPage from "./balancedialog/page"; // Import the dialog component
import { useSearchParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  fetchTotalBalance,
  deleteAccount,
} from "@/redux/slices/balanceSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { showSnackbar, closeSnackbar } from "@/redux/slices/snackBarSlice";
import {
  selectAccounts,
  selectTotalBalance,
  selectStatus,
  selectError,
} from "@/redux/selectors/balanceSelectors";

export default function BalancePage() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const accounts = useSelector(selectAccounts);
  const totalBalance = useSelector(selectTotalBalance);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [isChecked, setIsChecked] = useState(false);
  const [showDialog, setShowDialog] = useState(
    searchParams.get("showAddNew") === "true"
  );

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null); // Hold the current account for editing

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTotalBalance());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  // Memoize accounts for rendering
  const memoAccounts = useMemo(() => accounts, [accounts]);

  // Open the dialog for either adding a new account or editing an existing one
  const openDialog = (account = null) => {
    setCurrentAccount(account); // If editing, pass the account, otherwise null for adding new
    setShowDialog(true);
  };

  const openConfirmDialog = (accountId) => {
    setAccountToDelete(accountId);
    setConfirmDialog(true);
  };

  // Close the dialog
  const closeDialog = () => {
    setShowDialog(false);
    setCurrentAccount(null);
    fetchAccounts(); // Refresh accounts after save
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setAccountToDelete(null);
    setIsChecked(false);
  };

  const handleShowSnackbar = (message, severity = "success") => {
    dispatch(showSnackbar({ message, severity }));
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  // Handle Delete
  const handleDelete = async () => {
    if (isChecked && accountToDelete) {
      dispatch(deleteAccount(accountToDelete));
      closeConfirmDialog();
      handleShowSnackbar("Account deleted successfully!", "success");
    }
  };

  return (
    <div className="p-5 mt-14 container content-center">
      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 w-full">
            <div className="h-48 rounded-2xl text-center p-6 bg-teal-100 border border-gray-200 shadow-lg hover:bg-teal-200">
              <div className="mb-2 text-2xl font-bold">Total Balance</div>
              <br></br>
              <div className="mb-2 text-3xl font-bold">
                {currencySymbol} {totalBalance}
              </div>
            </div>
          </div>

          <ul>
            {memoAccounts.map((account) => (
              <li key={account.id}>
                <div className="grid grid-cols-4">
                  <div className="flex justify-between col-span-3 sm:w-96 rounded-2xl shadow-lg text-center content-center mt-3 p-6 bg-teal-100 border border-gray-200">
                    <div className="font-bold mr-5">{account.name}</div>
                    <div className="font-bold">
                      {currencySymbol} {account.balance}
                    </div>
                  </div>
                  <div className="flex content-center">
                    <button
                      onClick={() => openDialog(account)}
                      className="ml-3"
                    >
                      <FaPenSquare size={30} />
                    </button>
                    <button
                      onClick={() => openConfirmDialog(account.id)}
                      className="ml-5"
                    >
                      <FaTrash size={30} className="text-orange-400" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowDialog(true)}
            className="fixed shadow-lg right-5 bottom-5 sm:right-10 sm:bottom-10 bg-orange-300 font-bold py-4 px-6 rounded-2xl"
          >
            Add New
          </button>

          {showDialog && (
            <BalanceDialogPage
              accId={currentAccount?.id}
              name={currentAccount?.name}
              balance={currentAccount?.balance}
              onClose={closeDialog}
              onSuccess={handleShowSnackbar}
            />
          )}

          {confirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
              <div className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3">
                <h2 className="text-2xl mb-4 font-bold">Delete Card</h2>

                <div className="flex justify-evenly">
                  <div>
                    <FaExclamationTriangle
                      className="text-red-500 mr-4"
                      size={40}
                    />
                  </div>
                  <div>
                    <div className="mb-2">
                      Are you sure you want to delete this card?
                    </div>
                    <div className="font-bold mb-2">
                      If you deleted, all the related entries will be deleted!
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-4 ml-4">
                  <div>
                    <input
                      type="checkbox"
                      id="confirmDelete"
                      checked={isChecked}
                      onChange={toggleCheckbox}
                      className="w-5 h-5 rounded-md border-2 border-teal-500 bg-teal-50 checked:bg-teal-500 checked:border-teal-500 focus:ring-2 focus:ring-teal-200 cursor-pointer transition-colors duration-200"
                      autoComplete="off"
                    />
                  </div>
                  <label
                    htmlFor="confirmDelete"
                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    I understand the consequences of deleting this card.
                  </label>
                </div>
                <div className="flex justify-end">
                  <button onClick={closeConfirmDialog} className="mr-3">
                    Close
                  </button>
                  <button
                    onClick={handleDelete}
                    className={
                      !isChecked ? "opacity-50 cursor-not-allowed" : ""
                    }
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
        </>
      )}
    </div>
  );
}
