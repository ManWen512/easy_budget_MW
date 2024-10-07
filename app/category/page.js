"use client";

import { useEffect, useState } from "react";
import Home from "../page";
import CategoryDialog from "./categorydialog/page";
import { FaPenSquare, FaTrash } from "react-icons/fa";
import Snackbar from "@/components/snackBar";

export default function CategoryPage() {
  const [showDialog, setShowDialog] = useState();
  const [categories, setCategories] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const [ currentCategory, setCurrentCategory ] = useState(null);

 
    // For first render
    useEffect(() => {
      fetchCategories();
    }, []);

  const fetchCategories = async ()=> {
    const response = await fetch(`${mainUrl}/category/all`);
    const data = await response.json();
    setCategories(data);
  }


  const handleDelete = async (id) => {
    await fetch(`${mainUrl}/category?id=${id}`, { method: "DELETE" });
    // setCategories((prevCategories) =>
    //   prevCategories.filter((category) => category.id !== id)
    // );
    fetchCategories();
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

  return (
    <Home>
      <div className="balance-page relative ">
        <div className="text-3xl font-bold mb-5"> Categories </div>
        <ul className="accounts-list">
          {categories.map((cat) => (
            <li key={cat.id} className="account-item">
              <div className="grid grid-cols-2 gap-4 ">
                <div className="flex justify-center rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200 rounded-lg ">
                  <div className=" font-bold text-white">{cat.name}</div>
                </div>
                <div className="flex content-center ">
                  <button onClick={() => openDialog(cat) }  className="ml-5 ">
                    <FaPenSquare size={30} />
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="ml-5"
                  >
                    <FaTrash size={30} color="red"/>
                  </button>
                  {/* Delete Button */}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => openDialog()} className="fixed right-10 bottom-10 bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-4 px-6 rounded-2xl ">
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
        <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
      </div>
    </Home>
  );
}
