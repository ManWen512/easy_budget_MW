"use client";

import { useEffect, useState } from "react";

import CategoryDialog from "./categorydialog/page";
import { FaPenSquare, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Snackbar from "@/components/snackBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories,  deleteCategory } from "@/redux/slices/categorySlice";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [showDialog, setShowDialog] = useState();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);



  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
    setSnackbarMessage("Category deleted successfully!");
    setShowSnackbar(true);
  };

  const openDialog = (cat = null) => {
    setCurrentCategory(cat); // If editing, pass the category, otherwise null for adding new
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setCurrentCategory(null);
    fetchCategories(); // Refresh category after save
  };

  const handleShowSnackbar = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
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

  return (
    
      <div className="balance-page  mt-14 p-5 ">
        <div className="text-3xl font-bold mb-5"> Categories </div>
        <ul className="accounts-list">
          {categories.map((cat) => (
            <li key={cat.id} className="account-item">
              <div className="grid grid-cols-4 gap-2 sm:w-96">
                <div className="flex justify-center col-span-3 shadow-lg rounded-2xl text-center content-center mt-3  p-6 bg-teal-100  border border-gray-200  ">
                  <div className=" font-bold ">{cat.name}</div>
                </div>
                <div className="flex content-center ">
                  <button onClick={() => openDialog(cat)} className="ml-3">
                    <FaPenSquare size={30} />
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => openConfirmDialog(cat.id)}
                    className="ml-5"
                  >
                    <FaTrash size={30} className="text-orange-400" />
                  </button>
                  {/* Delete Button */}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => openDialog()}
          className="fixed shadow-lg right-5 bottom-5 sm:right-10 sm:bottom-10 bg-teal-100 hover:bg-teal-200 font-bold py-4 px-6 rounded-2xl "
        >
          Add New
        </button>{" "}
        {/* Add New Button */}
        {showDialog && (
          <CategoryDialog
            catId={currentCategory?.id} // Pass account ID if editing
            name={currentCategory?.name} // Pass account name if editing
            onClose={closeDialog} // Close function
            onSuccess={handleShowSnackbar}
          />
        )}
        {confirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
            <div className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3">
              <h2 className="text-2xl mb-4 font-bold ">
                Delete Card
              </h2>
              <div className="flex justify-evenly">
                <FaExclamationTriangle
                  className="text-red-500 mr-4"
                  size={40}
                />
                <div>
                  <div className=" mb-2">
                    Are you sure you want to delete this Category?
                  </div>
                  <div className=" font-bold mb-2">
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
                  autocomplete="off"
                />
                <label htmlFor="confirmDelete" className=" ">
                  I understand the consequences of deleting this Category.
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  className="border-2 border-teal-400 px-4 py-2 rounded-md mr-3"
                  onClick={() => closeConfirmDialog()}
                  type="button"
                >
                  Close
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    isChecked
                      ? "bg-teal-400"
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
   
  );
}
