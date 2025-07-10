"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdCategory,
} from "react-icons/md";
import { VscGraphScatter } from "react-icons/vsc";
import { IoCalendar, IoSettings } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { HiMenu, HiX } from "react-icons/hi";
import { RiRobot3Line, RiInformation2Fill } from "react-icons/ri";
import Image from "next/image";
import Pixel from "../public/Pixel.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { useRouter } from "next/navigation";
import { persistor } from "@/redux/store/store";

export default function Navbar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreenMenuOpen, setIsSmallScreenMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const { user, status, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

 

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

  useEffect(() => {
    closeSmallScreenMenu();
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <MdDashboard size={25} /> },
    {
      name: "Accounts",
      href: "/balance",
      icon: <MdAccountBalanceWallet size={25} />,
    },
    { name: "Categories", href: "/category", icon: <MdCategory size={25} /> },
    { name: "MonthEntry", href: "/monthEntry", icon: <IoCalendar size={25} /> },
    { name: "Graphs", href: "/graphs", icon: <VscGraphScatter size={25} /> },

    { name: "History", href: "/history", icon: <LuHistory size={25} /> },
    { name: "AIChat", href: "/ai-chat", icon: <RiRobot3Line size={25} /> },
    { name: "Setting", href: "/setting", icon: <IoSettings size={25} /> },
    {
      name: "AboutUs",
      href: "/aboutus",
      icon: <RiInformation2Fill size={25} />,
    },
  ];

  // const handleLogout = () => {
  //   dispatch(logout());
  //   persistor.purge();
  //   setDropdownOpen(false);

  //   router.push("/login");
  //   dispatch(showSnackbar({ message: "Successfully logged out", severity: "success" }));
  // };

  return (
    <div className="sm:flex sm:min-h-screen">
      {/* Desktop Profile or Login/Sign Up buttons */}
      <div className="hidden sm:flex fixed top-0 right-0 z-50 space-x-3 p-4">
        {isAuthenticated && user && (
          <Link href="/setting">
            <div className="relative">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black   border border-teal-500 text-teal-600 dark:text-teal-200 rounded-lg hover:bg-teal-50 font-semibold transition">
                <img
                  src={
                    user?.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user?.username || "U")
                  }
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-200"
                />
                <span>{user.username}</span>
              </div>
              {/* {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={
                      user.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.username || "U")
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <div className="font-bold">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
                >
                  Log out
                </button>
              </div>
            )} */}
            </div>
          </Link>
        )}
      </div>
      {/* Sidebar for md & lg screens */}
      <div
        className="fixed h-full bg-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black shadow-lg hidden sm:block z-40 transition-all duration-300"
        style={{ width: isSidebarOpen ? 256 : 64 }}
      >
        <div className="p-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="ml-auto mr-2 hover:scale-105 active:scale-95 transition-transform dark:text-white"
          >
            {isSidebarOpen ? <HiX size={30} /> : <HiMenu size={30} />}
          </button>
        </div>

        <div className="flex flex-col space-y-2 text-lg p-2">
          {menuItems.map((item, index) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center px-2 py-2 rounded-xl text-gray-600  hover:bg-teal-100 transition-all duration-300 ease-in-out ${
                  pathname === item.href
                    ? "dark:text-black bg-teal-100 border-l-4 border-teal-500 "
                    : "dark:text-gray-400"
                }`}
              >
                <div className="hover:scale-105 active:scale-95 transition-transform">
                  {item.icon}
                </div>
                <span
                  className={`ml-3 overflow-hidden transition-all duration-300 ${
                    isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
              {/* Tooltip for collapsed sidebar */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  {/* Tooltip arrow */}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Navbar for sm screens */}
      <div className="sm:hidden fixed top-0 left-0 w-full bg-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black shadow-md flex justify-between items-center px-4 py-3 z-50">
        <button
          onClick={toggleSmallScreenMenu}
          className="hover:scale-105 active:scale-95 transition-transform dark:text-white"
        >
          {isSmallScreenMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>

        <span className="flex text-lg font-bold justify-center items-center space-x-1 dark:text-white">
          <Image src={Pixel} alt="logo" />
          <span>Easy Budget</span>
        </span>
      </div>

      {/* Full-screen Overlay Sidebar for sm screens */}
      {isSmallScreenMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200 "
            onClick={closeSmallScreenMenu}
          />

          <div className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black shadow-lg z-50 p-4 sm:hidden flex flex-col justify-between transition-transform duration-300">
            <div>
              <button
                onClick={closeSmallScreenMenu}
                className="mb-4 hover:scale-105 active:scale-95 transition-transform dark:text-white"
              >
                <HiX size={30} />
              </button>
              <div className="flex flex-col space-y-3 text-sm">
                {menuItems.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeSmallScreenMenu}
                      className={`block px-2 py-2 rounded-xl text-gray-600 hover:bg-teal-100 transition-all duration-300 ${
                        pathname === item.href
                          ? "bg-teal-100 border-l-4 border-teal-500 dark:text-black"
                          : "dark:text-gray-400"
                      }`}
                    >
                      <div className="flex space-x-2 hover:translate-x-1 transition-transform">
                        <span className="hover:rotate-5 transition-transform">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {/* Mobile Profile or Login/Sign Up buttons */}
            <div className="flex flex-col space-y-2 mt-6 mb-2">
              {isAuthenticated && user && (
                <Link href="/setting">
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        user?.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(user.username || "U")
                      }
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300 mb-2"
                    />
                    <div className="font-bold dark:text-white">
                      {user.username}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className="flex-1 sm:block transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? 256 : 0 }}
      >
        <div
          className={`w-full ${
            !isSidebarOpen ? "sm:max-w-4xl sm:mx-auto" : ""
          }`}
        >
          <div key={pathname} className="transition-all duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
