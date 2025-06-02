// layout.js
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";


export default function Wrap({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  // Load sidebar state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarState");
    if (storedState !== null) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 sm:flex-1 sm:flex sm:flex-col sm:items-center px-4 sm:px-6 md:px-8 sm:max-w-4xl sm:mx-auto sm:w-full`}>
        {children}
      </div>
    </div>
  );
}
