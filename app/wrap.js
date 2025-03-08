// layout.js
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";


export default function Wrap({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log("wrap loaded");

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
      <div className={`transition-all duration-300  `}>
        {children}
      </div>
    </div>
  );
}
