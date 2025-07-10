"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { selectCurrency } from "@/redux/selectors/settingsSelectors";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { fetchMonthEntries, setMonth, setYear } from "@/redux/slices/monthEntrySlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  selectMonthEntries,
  selectTotalIncome,
  selectTotalOutcome,
  selectTotalBalance,
  selectYear,
  selectMonth,
  selectStatus,
  selectError,
} from "@/redux/selectors/monthEntrySelectors";

export default function MonthEntryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { open, message, severity } = useSelector((state) => state.snackbar);
  const monthEntries = useSelector(selectMonthEntries);
  const totalIncome = useSelector(selectTotalIncome);
  const totalOutcome = useSelector(selectTotalOutcome);
  const totalBalance = useSelector(selectTotalBalance);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const currencySymbol = useSelector(selectCurrency);

  useEffect(() => {
    dispatch(fetchMonthEntries({ year, month }));
  }, [dispatch, year, month]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

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

  // Group entries by date for all views (memoized)
  const groupedEntries = useMemo(() => {
    return monthEntries.reduce((acc, entry) => {
      const date = new Date(entry.dateTime).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
  }, [monthEntries]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Top bar with month navigation */}
      
      <div className=" p-5 mt-14 sm:mt-0 mx-auto w-[90vw] sm:w-full">
      <div className="text-3xl font-bold mb-5 dark:text-white">Entries</div>
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
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 rounded-xl shadow p-3 text-center">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-200">Income</div>
            <div className="text-green-600 font-bold">
              {currencySymbol} {totalIncome}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-200">Outcome</div>
            <div className="text-red-500  font-bold">
              {currencySymbol} {totalOutcome}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-200">Total</div>
            <div className="text-gray-800 dark:text-gray-400 font-bold">
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
                          {item.categoryDto.name}
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
                          {item.accountDto.name.charAt(0).toUpperCase() +
                            item.accountDto.name.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>


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
