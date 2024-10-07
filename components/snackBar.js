import { useState, useEffect } from "react";

export default function Snackbar({ message, show, onClose }) {
  // Automatically close the Snackbar after 3 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [show, onClose]);

  return (
    <>
      {show && (
        <div className="fixed top-4 right-1 transform -translate-x-1/2 bg-gray-800 text-sm text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300 ease-in-out">
          {message}
        </div>
      )}
    </>
  );
}
