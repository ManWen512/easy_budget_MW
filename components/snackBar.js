"use client";

import { useState, useEffect } from "react";

export default function Snackbar({ message, show, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      setProgress(0); // Reset the progress to 100 when the Snackbar shows

      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev + 5, 0)); // Decrease the progress by 5% every 100ms
      }, 100);

      return () => {
        clearTimeout(timer); // Cleanup the timer
        clearInterval(interval); // Cleanup the interval
      };
    }
  }, [show, onClose]);

  return (
    <>
      {show && (
        <div className="fixed top-4 right-4 bg-teal-100 text-sm px-6 py-3 rounded-md shadow-lg transition-opacity duration-700 ease-in-out">
          {message}
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-300 absolute bottom-0 left-0 rounded-b-md">
            <div
              className="h-full bg-teal-500 rounded-b-md transition-all duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}

