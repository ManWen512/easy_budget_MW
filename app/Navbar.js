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
import { motion, AnimatePresence } from "framer-motion";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

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

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for md & lg screens */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        className="fixed h-full bg-white shadow-lg hidden sm:block z-40"
        style={{ width: isSidebarOpen ? 256 : 64 }}
      >
        <div className="p-3 flex items-center justify-between">
          <motion.button
            onClick={toggleSidebar}
            className="ml-auto mr-2"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {isSidebarOpen ? <HiX size={30} /> : <HiMenu size={30} />}
          </motion.button>
        </div>

        <motion.div 
          className="flex flex-col space-y-5 text-xl p-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              custom={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: (i) => ({
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                })
              }}
            >
              <Link
                href={item.href}
                className={`flex items-center px-2 py-3 rounded-xl text-gray-600 hover:bg-teal-100 transition-all duration-300 ease-in-out ${
                  pathname === item.href
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : ""
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: isSidebarOpen ? 1 : 0,
                    x: isSidebarOpen ? 0 : -10,
                    width: isSidebarOpen ? "auto" : 0
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="ml-3 overflow-hidden"
                >
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Top Navbar for sm screens */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        className="sm:hidden fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-4 py-3 z-50"
      >
        <motion.button
          onClick={toggleSmallScreenMenu}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isSmallScreenMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </motion.button>

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          className="flex text-lg font-bold justify-center items-center space-x-1"
        >
          <Image src={Pixel} alt="logo" />
          <span>Easy Budget</span>
        </motion.span>
      </motion.div>

      {/* Full-screen Overlay Sidebar for sm screens */}
      <AnimatePresence>
        {isSmallScreenMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeSmallScreenMenu}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
              }}
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 sm:hidden"
            >
              <motion.button
                onClick={closeSmallScreenMenu}
                className="mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <HiX size={30} />
              </motion.button>
              <motion.div 
                className="flex flex-col space-y-5 text-xl"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: (i) => ({
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: i * 0.1,
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }
                      })
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeSmallScreenMenu}
                      className={`block px-2 py-3 rounded-xl text-gray-600 hover:bg-teal-100 transition-all duration-300 ${
                        pathname === item.href
                          ? "bg-teal-100 border-l-4 border-teal-500"
                          : ""
                      }`}
                    >
                      <motion.div
                        className="flex space-x-2"
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <motion.span
                          whileHover={{ rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content with Page Transitions */}
      <motion.div
        initial={{ marginLeft: isSidebarOpen ? 256 : 0 }}
        animate={{ marginLeft: isSidebarOpen ? 256 : 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        className="flex-1 sm:block"
      >
        <div className={`w-full ${!isSidebarOpen ? "sm:max-w-4xl sm:mx-auto" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
