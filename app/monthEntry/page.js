"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Snackbar from "@/components/snackBar";
import { currencySymbol } from "../currency";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchMonthEntries,
  setMonth,
  setYear,
  clearSnackbar,
  setSnackbar,
} from "@/redux/slices/monthEntrySlice";

export default function MonthEntryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    monthEntries,
    totalIncome,
    totalOutcome,
    totalBalance,
    year,
    month,
    isLoading,
  } = useSelector((state) => state.monthEntry);

  useEffect(() => {
    dispatch(fetchMonthEntries({ year, month }));
  }, [dispatch, year, month]);

  useEffect(() => {
    const triggerSnackbar = searchParams.get("triggerSnackbar");
    if (triggerSnackbar) {
      setSnackbarMessage(triggerSnackbar);
      setShowSnackbar(true);
    }
  }, [searchParams, dispatch]);

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setSnackbarMessage("");
  };

  // Helper function to handle month navigation
  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (month === 1) {
        dispatch(setMonth(12));
        dispatch(setYear(year - 1));
      } else {
        dispatch(setMonth(month - 1));
      }
    } else if (direction === "next") {
      if (month === 12) {
        dispatch(setMonth(1));
        dispatch(setYear(year + 1));
      } else {
        dispatch(setMonth(month + 1));
      }
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Handle row click to navigate to the detail page
  const handleRowClick = (id) => {
    router.prefetch(`/monthEntry/${id}`);
    router.push(`/monthEntry/${id}`);
  };

  return (
    <>
      <motion.div 
        className="flex justify-center content-center p-5 mt-14 mx-auto w-screen sm:w-[60vw]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center content-center items-center mb-2">
          <motion.button
            onClick={() => handleMonthChange("prev")}
            className="text-3xl mr-3 text-orange-400"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <BiSolidLeftArrow />
          </motion.button>
          <motion.div 
            className="rounded-2xl shadow-lg w-1/2 text-center block p-3 bg-orange-400 border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-1xl font-bold">{`${monthNames[month - 1]} ${year}`}</div>
          </motion.div>
          <motion.button
            onClick={() => handleMonthChange("next")}
            className="text-3xl ml-3 text-orange-400"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <BiSolidRightArrow />
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="w-screen sm:w-[60vw] sm:ml-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex space-x-2 justify-center items-center h-screen">
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          </div>
        ) : monthEntries.length > 0 ? (
          <>
            <motion.table 
              className="max-w block overflow-x-auto border-separate border-spacing-2 px-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <thead>
                <tr>
                  <motion.th 
                    className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold uppercase tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    Date
                  </motion.th>
                  <motion.th 
                    className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold uppercase tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    Categories
                  </motion.th>
                  <motion.th 
                    className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold uppercase tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    Cost
                  </motion.th>
                  <motion.th 
                    className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold uppercase tracking-wider"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    Card
                  </motion.th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {monthEntries.map((item, index) => {
                    const currentDate = new Date(item.dateTime).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });

                    const previousDate = index > 0
                      ? new Date(monthEntries[index - 1].dateTime).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : null;

                    return (
                      <motion.tr
                        key={item.id}
                        className={`border-b cursor-pointer ${
                          item.type === "INCOME"
                            ? "bg-green-100 hover:bg-green-200"
                            : "bg-red-100 hover:bg-red-200"
                        }`}
                        onClick={() => handleRowClick(item.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <td className={`${
                          currentDate !== previousDate
                            ? "rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700"
                            : "bg-white cursor-default"
                        }`}>
                          {currentDate !== previousDate && currentDate}
                        </td>
                        <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                          {item.category.name}
                        </td>
                        <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                          {currencySymbol} {item.cost}
                        </td>
                        <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                          {item.account.name.charAt(0).toUpperCase() + item.account.name.slice(1)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <td></td>
                  {totalIncome !== 0 && (
                    <>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold text-gray-700">
                        Total Income
                      </td>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold text-gray-700">
                        {currencySymbol} {totalIncome}
                      </td>
                    </>
                  )}
                </motion.tr>
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <td></td>
                  {totalOutcome !== 0 && (
                    <>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold text-gray-700">
                        Total Outcome
                      </td>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold text-gray-700">
                        {currencySymbol} {totalOutcome}
                      </td>
                    </>
                  )}
                </motion.tr>
              </tbody>
            </motion.table>
            <div className="h-16"></div>
          </>
        ) : (
          <motion.div 
            className="font-bold text-1xl px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No datas found!
          </motion.div>
        )}
      </motion.div>

      <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={handleSnackbarClose}
      />

      <motion.div 
        className="fixed bottom-6 right-2 sm:bottom-10 sm:right-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Link href={"/entry/addEditEntry"}>
          <motion.div
            className="rounded-xl shadow-lg bg-teal-100 hover:bg-teal-400 font-bold py-4 px-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Add New Entry
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}
