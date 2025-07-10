// layout.js
"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import AuthGuard from "./AuthGuard";
import AppSnackbar from "@/components/AppSnackbar";
import AppInitWrapper from "./AppInitWrapper";

export default function Wrap({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const showNavbar =
    pathname !== "/" && pathname !== "/login" && pathname !== "/signup";

  // Load sidebar state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarState");
    if (storedState !== null) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);

  return (
    <div className={showNavbar ? "sm:flex sm:min-h-screen " : ""}>
      {showNavbar && (
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <AppSnackbar />
      <div
        className={
          showNavbar
            ? "transition-all duration-300 sm:flex-1 sm:flex sm:flex-col sm:items-center px-4 sm:px-6 md:px-8 sm:max-w-4xl sm:mx-auto sm:w-full"
            : ""
        }
      >
        <AuthGuard>
          <AppInitWrapper>{children}</AppInitWrapper>
        </AuthGuard>
      </div>
    </div>
  );
}
