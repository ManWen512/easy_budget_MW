"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import { currencySymbol } from "../currency";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchMonthEntries,
  setMonth,
  setYear,
  clearSnackbar,
} from "@/redux/slices/monthEntrySlice";
import LoadingSpinner from "@/components/LoadingSpinner";

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
    status,
    error,
  } = useSelector((state) => state.monthEntry);

  useEffect(() => {
    dispatch(fetchMonthEntries({ year, month }));
  }, [dispatch, year, month]);

  useEffect(() => {
    const message = searchParams.get("triggerSnackbar");
    if (message) {
      setSnackbarMessage(message);
      setShowSnackbar(true);
    }
  }, [searchParams]);

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    clearSnackbar();
    setShowSnackbar(false);
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

  // Group entries by date for all views
  const groupedEntries = monthEntries.reduce((acc, entry) => {
    const date = new Date(entry.dateTime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* Top bar with month navigation */}
      <div className="flex justify-center content-center p-5 mt-14 mx-auto w-screen sm:w-[60vw]">
        <div className="flex justify-center content-center items-center mb-2 w-full">
          <button
            onClick={() => handleMonthChange("prev")}
            className="text-3xl mr-3 text-orange-400"
          >
            <BiSolidLeftArrow />
          </button>
          <div className="rounded-2xl shadow-lg flex-1 text-center block p-3 bg-orange-400 border border-gray-200">
            <div className="text-1xl font-bold">{`${
              monthNames[month - 1]
            } ${year}`}</div>
          </div>
          <button
            onClick={() => handleMonthChange("next")}
            className="text-3xl ml-3 text-orange-400"
          >
            <BiSolidRightArrow />
          </button>
        </div>
      </div>

      {/* Summary row (all screens) */}
      <div className="w-full px-4 mb-2">
        <div className="flex justify-between items-center bg-white rounded-xl shadow p-3 text-center">
          <div>
            <div className="text-xs text-gray-500">Income</div>
            <div className="text-green-600 font-bold">
              {currencySymbol} {totalIncome}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Outcome</div>
            <div className="text-red-500 font-bold">
              {currencySymbol} {totalOutcome}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-gray-800 font-bold">
              {currencySymbol} {totalBalance}
            </div>
          </div>
        </div>
      </div>

      {/* Grouped entries (all screens) */}
      <div className="w-full px-2">
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="font-bold text-1xl px-5">No datas found!</div>
        ) : (
          Object.entries(groupedEntries)
            .sort((a, b) => {
              // Sort by date descending
              const [da] = a,
                [db] = b;
              return (
                new Date(db.split("/").reverse().join("-")) -
                new Date(da.split("/").reverse().join("-"))
              );
            })
            .map(([date, entries]) => (
              <div key={date} className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-xs font-bold mr-2">
                    {date}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {entries.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-xl shadow  px-3 py-2 flex flex-col border border-gray-100 cursor-pointer ${
                        item.type === "INCOME"
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-red-100 hover:bg-red-200"
                      }`}
                      onClick={() => handleRowClick(item.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-800">
                          {item.category.name}
                        </div>
                        <div
                          className={
                            item.type === "INCOME"
                              ? "text-green-600 font-bold"
                              : "text-red-500 font-bold"
                          }
                        >
                          {item.type === "INCOME" ? "+" : "-"}
                          {currencySymbol}
                          {item.cost}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-500 truncate max-w-[60%]">
                          {item.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.account.name.charAt(0).toUpperCase() +
                            item.account.name.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      <Snackbar
        message={snackbarMessage}
        open={showSnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
      {status === "failed" && (
          <Snackbar
            severity="error"
            message={error} 
            open={true}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          />
        )}

      {/* Add New Entry button: icon only on sm, text on larger screens */}
      <div className="fixed bottom-6 right-2 sm:bottom-10 sm:right-10">
        <Link href={"/entry/addEditEntry"}>
          <>
            <div className="block sm:hidden">
              <div className="rounded-full shadow-lg bg-orange-400 hover:bg-orange-500 p-4 flex items-center justify-center">
                <FiPlus className="text-white text-2xl" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-xl shadow-lg bg-teal-100 hover:bg-teal-400 font-bold py-4 px-6">
                Add New Entry
              </div>
            </div>
          </>
        </Link>
      </div>
    </>
  );
}
