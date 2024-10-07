"use client";

import { useEffect, useState } from "react";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import BalanceDialogPage from "./balancedialog/page"; // Import the dialog component
import Home from "../page";
import Snackbar from "@/components/snackBar";

export default function BalancePage() {
  const [isChecked, setIsChecked] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null); // Hold the current account for editing
  const accUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch all accounts and total balance
  const fetchAccounts = async () => {
    const response = await fetch(`${accUrl}/account/all`);
    const data = await response.json();
    const response1 = await fetch(`${accUrl}/account/totalBalance`);
    const data1 = await response1.json();
    setAccounts(data);
    setTotalBalance(data1);
  };

  // Handle delete account
  const handleDelete = async (id) => {
    try {
      await fetch(`${accUrl}/account?id=${id}`, { method: "DELETE" });
      fetchAccounts(); // Refresh the accounts after deletion
      setSnackbarMessage("Account deleted successfully!");
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

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
  };

  const handleShowSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  return (
    <Home>
      <div className="balance-page relative ">
        <div className="grid grid-cols-2 gap-4 ">
          <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200 rounded-lg shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
            <div className="mb-2 text-2xl font-bold text-white">
              Total Balance
            </div>
            <br></br>
            <div className="mb-2 text-3xl font-bold text-white">
              ${totalBalance}
            </div>
          </div>
        </div>
        <ul className="accounts-list">
          {accounts.map((account) => (
            <li key={account.id} className="account-item">
              <div className="grid grid-cols-2 gap-4 ">
                <div className="flex justify-between rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200 rounded-lg ">
                  <div className=" font-bold text-white">{account.name}</div>
                  <div className=" font-bold text-white">
                    ${account.balance}
                  </div>
                </div>
                <div className="flex content-center ">
                  <button onClick={() => openDialog(account)} className="ml-5 ">
                    <FaPenSquare size={30} />
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => openConfirmDialog(account.id)}
                    className="ml-5"
                  >
                    <FaTrash size={30} color="red" />
                  </button>
                  {/* Delete Button */}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => openDialog()}
          className="fixed right-10 bottom-10 bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-4 px-6 rounded-2xl "
        >
          Add New
        </button>{" "}
        {/* Add New Button */}
        {showDialog && (
          <BalanceDialogPage
            accId={currentAccount?.id} // Pass account ID if editing
            name={currentAccount?.name} // Pass account name if editing
            balance={currentAccount?.balance} // Pass account balance if editing
            onClose={closeDialog} // Close function
            onSuccess={handleShowSnackbar}
          />
        )}
        {confirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-yellow-950 p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4 font-bold text-white">
                Delete Card
              </h2>
              <div className="flex justify-evenly">
                <FaExclamationTriangle
                  className="text-red-500 mr-4"
                  size={40}
                />
                <div>
                  <div className="text-white mb-2">
                    Are you sure you want to delete this card?
                  </div>
                  <div className="text-white font-bold mb-2">
                    If you deleted, all the related entries will be deleted!
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
                  I understand the consequences of deleting this card.
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
                    isChecked
                      ? "bg-yellow-700"
                      : "bg-gray-400 cursor-not-allowed"
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
        <Snackbar
          message={snackbarMessage}
          show={showSnackbar}
          onClose={() => setShowSnackbar(false)}
        />
      </div>
    </Home>
  );
}
