"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdCategory,
} from "react-icons/md";
import { VscGraphScatter } from "react-icons/vsc";
import { IoCalendar } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import Pixel from "../public/Pixel.png";

export default function Navbar({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreenMenuOpen, setIsSmallScreenMenuOpen] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarState");
    if (storedState !== null) {
      setIsSidebarOpen(JSON.parse(storedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleSmallScreenMenu = () => setIsSmallScreenMenuOpen((prev) => !prev);

  const closeSmallScreenMenu = () => setIsSmallScreenMenuOpen(false);

  // Close sidebar on small screens when navigating
  useEffect(() => {
    closeSmallScreenMenu();
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: <MdDashboard size={30} /> },
    {
      name: "Balance",
      href: "/balance",
      icon: <MdAccountBalanceWallet size={30} />,
    },
    { name: "Categories", href: "/category", icon: <MdCategory size={30} /> },
    { name: "Graphs", href: "/graphs", icon: <VscGraphScatter size={30} /> },
    { name: "MonthEntry", href: "/monthEntry", icon: <IoCalendar size={30} /> },
    { name: "History", href: "/history", icon: <LuHistory size={30} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen z-50">
      {/* Sidebar for md & lg screens */}
      <div
        className={`fixed h-full bg-white shadow-lg transition-all duration-300 hidden sm:block 
        ${isSidebarOpen ? "w-64" : "w-16"} ease-in-out`}
      >
        <div className="p-3 flex items-center justify-between">
          <button onClick={toggleSidebar} className="ml-auto mr-2">
            {isSidebarOpen ? <HiX size={30} /> : <HiMenu size={30} />}
          </button>
        </div>

        <div className="flex flex-col space-y-5 text-xl p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-3 rounded-xl text-gray-600 hover:bg-teal-100 transition-all duration-300 ease-in-out ${
                pathname === item.href
                  ? "bg-teal-100 border-l-4 border-teal-500"
                  : ""
              }`}
            >
              {item.icon}
              <span
                className={`ml-3 transition-all duration-300 ${
                  isSidebarOpen
                    ? "opacity-100 w-auto"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Navbar for sm screens */}
      <div className="sm:hidden fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-4 py-3 z-50">
        <button onClick={toggleSmallScreenMenu}>
          {isSmallScreenMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>

        <span className="flex text-lg font-bold justify-center items-center space-x-1">
          <Image src={Pixel} alt="logo"/>
          <span >Easy Budget</span>
        </span>
      </div>

      {/* Full-screen Overlay Sidebar for sm screens */}
      {isSmallScreenMenuOpen && (
        <>
          {/* Dimming Background */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
            onClick={closeSmallScreenMenu}
          ></div>

          {/* Sidebar Overlay */}
          <div className="fixed top-0 left-0 w-64 h-full overflow-hidden bg-white shadow-lg z-50 p-4 sm:hidden transform transition-transform duration-300 ease-in-out animate-slideInLeft">
            <button onClick={closeSmallScreenMenu} className="mb-4">
              <HiX size={30} />
            </button>
            <div className="flex flex-col space-y-5 text-xl">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSmallScreenMenu} // Close menu on click
                  className={`block px-2 py-3 rounded-xl text-gray-600 hover:bg-teal-100 transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-teal-100 border-l-4 border-teal-500"
                      : ""
                  }`}
                >
                  <div className="flex space-x-2">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300 sm:ml-16 md:ml-64">
        {children}
      </div>
    </div>
  );
}
