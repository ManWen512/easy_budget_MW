"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

import CategoryDialog from "./categorydialog/page";
import { FaPenSquare, FaTrash, FaExclamationTriangle, FaPlus } from "react-icons/fa";
import Snackbar from "@/components/snackBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories,  deleteCategory } from "@/redux/slices/categorySlice";
import AnimatedButton from "@/components/AnimatedButton";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [showDialog, setShowDialog] = useState(searchParams.get("showAddNew") === "true");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async () => {
    if (isChecked && accountToDelete) {
      dispatch(deleteCategory(accountToDelete));
      closeConfirmDialog();
      setSnackbarMessage("Category deleted successfully!");
      setShowSnackbar(true);
    }
  };

  const openDialog = (cat = null) => {
    setCurrentCategory(cat);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setCurrentCategory(null);
    dispatch(fetchCategories());
  };

  const handleShowSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const openConfirmDialog = (categoryId) => {
    setAccountToDelete(categoryId);
    setConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(false);
    setAccountToDelete(null);
    setIsChecked(false);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <motion.div 
      className="balance-page mt-14 p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-3xl font-bold mb-5"
        variants={itemVariants}
      >
        Categories
      </motion.div>

      <motion.ul 
        className="accounts-list"
        variants={containerVariants}
      >
        {categories.map((cat) => (
          <motion.li 
            key={cat.id} 
            className="account-item"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="grid grid-cols-4 gap-2 sm:w-96">
              <motion.div 
                className="flex justify-center col-span-3 shadow-lg rounded-2xl text-center content-center mt-3 p-6 bg-teal-100 border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="font-bold">{cat.name}</div>
              </motion.div>
              <div className="flex content-center">
                <button onClick={() => openDialog(cat)} className="ml-3">
                  <FaPenSquare size={30} />
                </button>
                <button
                  onClick={() => openConfirmDialog(cat.id)}
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
          delay: 0.2
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add New
      </motion.button>

      {showDialog && (
        <CategoryDialog
          catId={currentCategory?.id}
          name={currentCategory?.name}
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
              <FaExclamationTriangle className="text-red-500 mr-4" size={40} />
              <div>
                <div className="mb-2">
                  Are you sure you want to delete this Category?
                </div>
                <div className="font-bold mb-2">
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
                autoComplete="off"
              />
              <label htmlFor="confirmDelete">
                I understand the consequences of deleting this Category.
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
