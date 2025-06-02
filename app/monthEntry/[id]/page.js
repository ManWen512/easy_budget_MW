"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { currencySymbol } from "@/app/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchEntryDetail, deleteEntry, clearEntryDetail } from "@/redux/slices/entryDetailSlice";
import Snackbar from "@/components/snackBar";
import AnimatedButton from "@/components/AnimatedButton";

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

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="month-entry-page p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="sm:mx-40 m-5 mt-20 sm:mt-0 p-10 sm:p-20 bg-white rounded-lg shadow-lg"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={() => router.back()}
          className="mb-4"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <BsArrowLeftCircleFill size={30}/>
        </motion.button>
        <motion.h1 
          className="text-2xl font-bold mb-4"
          variants={itemVariants}
        >
          Details
        </motion.h1>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Date<div>:</div>
          </div>
          <div>{entry.dateTime}</div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Category<div>:</div>
          </div>
          <div>{entry.category.name}</div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Cost<div>:</div>
          </div>
          <div>
            {currencySymbol}
            {entry.cost}
          </div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Card<div>:</div>
          </div>
          <div>
            {entry.account.name.charAt(0).toUpperCase() +
              entry.account.name.slice(1)}
          </div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Status<div>:</div>
          </div>
          <motion.div
            className={`px-3 py-1 w-full text-center rounded-full text-xs ${
              entry.type === "INCOME"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {entry.type}
          </motion.div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 mb-4"
          variants={itemVariants}
        >
          <div className="text-gray-500 mr-3 flex justify-between">
            Description<div>:</div>
          </div>
          <div>{entry.description}</div>
        </motion.div>
        <motion.div 
          className="flex justify-end"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
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
              <button className="ml-5">
                <FaPenSquare size={30} />
              </button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <button
              onClick={() => openConfirmDialog(entry.id)}
              className="ml-5"
            >
              <FaTrash size={30} className="text-red-400" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {confirmDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2"
          >
            <motion.div 
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3"
            >
              <motion.h2 
                className="text-2xl mb-4 font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Delete Entry
              </motion.h2>
              <motion.div 
                className="flex justify-evenly"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaExclamationTriangle className="text-red-500 mr-4" size={40} />
                <div>
                  <div className="mb-2">
                    Are you sure you want to delete this entry?
                  </div>
                  <div className="font-bold mb-2">
                    This action cannot be undone!
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center mb-4 ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
              </motion.div>
              <motion.div 
                className="flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Snackbar
        message={triggerSnackbar}
        show={triggerSnackbar}
        onClose={() => triggerSnackbar(false)}
      />
    </motion.div>
  );
};

export default EntryDetailPage;