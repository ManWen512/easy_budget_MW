"use client";

import { useEffect, useState } from "react";
import {
  FaPenSquare,
  FaTrash,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import BalanceDialogPage from "./balancedialog/page"; // Import the dialog component
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Snackbar from "@/components/snackBar";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  fetchTotalBalance,
  deleteAccount,
} from "@/redux/slices/balanceSlice";
import AnimatedButton from "@/components/AnimatedButton";

export default function BalancePage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { accounts, totalBalance, status, error } = useSelector(
    (state) => state.balance
  );
  const [isChecked, setIsChecked] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showDialog, setShowDialog] = useState(searchParams.get("showAddNew") === "true");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null); // Hold the current account for editing

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTotalBalance());
  }, [dispatch]);

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

  const handleShowSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  // Handle Delete
  const handleDelete = async () => {
    if (isChecked && accountToDelete) {
      dispatch(deleteAccount(accountToDelete));
      closeConfirmDialog();
      setSnackbarMessage("Account deleted successfully!");
      setShowSnackbar(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="p-5 mt-14 container content-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="grid grid-cols-1 w-full" variants={itemVariants}>
        <motion.div
          className="h-48 rounded-2xl text-center p-6 bg-teal-100 border border-gray-200 shadow-lg hover:bg-teal-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="mb-2 text-2xl font-bold">Total Balance</div>
          <br></br>
          <div className="mb-2 text-3xl font-bold">
            {currencySymbol} {totalBalance}
          </div>
        </motion.div>
      </motion.div>

      {status === "loading" && (
        <div className="flex space-x-2 justify-center items-center h-screen">
          <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
          <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
        </div>
      )}

      {status === "failed" && <p className="text-red-500">{error}</p>}

      <motion.ul variants={containerVariants}>
        {accounts.map((account) => (
          <motion.li
            key={account.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="grid grid-cols-4">
              <motion.div
                className="flex justify-between col-span-3 sm:w-96 rounded-2xl shadow-lg text-center content-center mt-3 p-6 bg-teal-100 border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="font-bold mr-5">{account.name}</div>
                <div className="font-bold">
                  {currencySymbol} {account.balance}
                </div>
              </motion.div>
              <div className="flex content-center">
                <button onClick={() => openDialog(account)} className="ml-3">
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
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        onClick={() => setShowDialog(true)}
        className="fixed shadow-lg right-5 bottom-5 sm:right-10 sm:bottom-10 bg-orange-300 font-bold py-4 px-6 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add New
      </motion.button>

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3"
          >
            <h2 className="text-2xl mb-4 font-bold">Delete Card</h2>

            <div className="flex justify-evenly">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <FaExclamationTriangle
                  className="text-red-500 mr-4"
                  size={40}
                />
              </motion.div>
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
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <input
                  type="checkbox"
                  id="confirmDelete"
                  checked={isChecked}
                  onChange={toggleCheckbox}
                  className="w-5 h-5 rounded-md border-2 border-teal-500 bg-teal-50 checked:bg-teal-500 checked:border-teal-500 focus:ring-2 focus:ring-teal-200 cursor-pointer transition-colors duration-200"
                  autoComplete="off"
                />
              </motion.div>
              <label
                htmlFor="confirmDelete"
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
              >
                I understand the consequences of deleting this card.
              </label>
            </div>
            <div className="flex justify-end">
              <AnimatedButton
                onClick={closeConfirmDialog}
                variant="secondary"
                className="mr-3"
              >
                Close
              </AnimatedButton>
              <AnimatedButton
                onClick={handleDelete}
                variant={isChecked ? "danger" : "primary"}
                className={!isChecked ? "opacity-50 cursor-not-allowed" : ""}
                disabled={!isChecked}
              >
                Delete
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </motion.div>
  );
}
