"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Snackbar from "@/components/snackBar";
import { currencySymbol } from "../currency";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

export default function MonthEntryPage() {
  const [monthEntries, setMonthEntries] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const searchParams = useSearchParams(); // Use this to access query parameters
  const date = new Date();
  const [year, setYear] = useState(
    searchParams.get("year") || date.getFullYear()
  );
  const [month, setMonth] = useState(
    searchParams.get("month") || date.getMonth() + 1
  ); // Default to current month if not present in query params
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar visibility
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry`;
  const router = useRouter();

  const fetchEntries = async (year, month) => {
    setIsLoading(true); // Set loading state before fetching
    try {
      const response = await fetch(
        `${mainUrl}/monthEntry?year=${year}&month=${month}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMonthEntries(data.entries);
      setTotalIncome(data.totalIncome);
      setTotalOutcome(data.totalOutcome);
      setTotalBalance(data.totalBalance);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  // Initial data fetch and whenever month/year changes
  useEffect(() => {
    fetchEntries(year, month);
  }, [year, month]);

  // Check for Snackbar trigger on page load
  useEffect(() => {
    const triggerSnackbar = searchParams.get("triggerSnackbar");
    if (triggerSnackbar) {
      setSnackbarMessage(triggerSnackbar);
      setShowSnackbar(true);
    }
  }, [searchParams]);

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setSnackbarMessage("");
  };

  // Helper function to handle month navigation
  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (month === 1) {
        setMonth(12);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else if (direction === "next") {
      if (month === 12) {
        setMonth(1);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
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
    router.push(`/monthEntry/${id}?month=${month}&year=${year}`);
  };

  return (
    <>
      <div className="flex justify-center content-center p-5 mt-14 mx-auto w-screen sm:w-[60vw] ">
        <div className="flex justify-center content-center items-center mb-2 ">
          <button
            onClick={() => handleMonthChange("prev")}
            className="text-3xl mr-3 text-orange-400"
          >
            <BiSolidLeftArrow />
          </button>
          <div className="rounded-2xl shadow-lg w-1/2 text-center block p-3 bg-orange-400 border border-gray-200">
            <div className="text-1xl  font-bold">{`${
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

      <div className="w-screen sm:w-[60vw] sm:ml-20">
        {isLoading ? (
          <div className="flex space-x-2 justify-center items-center h-screen">
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          </div>
        ) : monthEntries.length > 0 ? (
          <>
            <table className="max-w block overflow-x-auto border-separate border-spacing-2 px-5  ">
              <thead>
                <tr>
                  <th className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold  uppercase tracking-wider ">
                    Date
                  </th>
                  <th className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold  uppercase tracking-wider ">
                    Categories
                  </th>
                  <th className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold  uppercase tracking-wider ">
                    Cost
                  </th>
                  <th className="rounded-xl shadow-lg py-3 px-6 border-l-4 border-teal-500 bg-teal-100 text-left text-sm font-semibold  uppercase tracking-wider ">
                    Card
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthEntries.map((item, index) => {
                  // Format the current entry's date as DD-MM-YYYY
                  const currentDate = new Date(
                    item.dateTime
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  // Check if the current entry's date is the same as the previous entry's date
                  const previousDate =
                    index > 0
                      ? new Date(
                          monthEntries[index - 1].dateTime
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : null;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b cursor-pointer ${
                        item.type === "INCOME"
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-red-100 hover:bg-red-200"
                      }`}
                      onClick={() => handleRowClick(item.id)} // Navigate on row click
                    >
                      <td
                        className={`${
                          currentDate !== previousDate
                            ? "rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700"
                            : "bg-white cursor-default"
                        } `}
                      >
                        {currentDate !== previousDate && currentDate}
                      </td>
                      <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                        {item.category.name}
                      </td>
                      <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                        {/* dollar Sign */}
                        {currencySymbol} {item.cost}
                      </td>
                      <td className="rounded-2xl shadow-lg py-4 px-6 text-sm text-gray-700">
                        {item.account.name.charAt(0).toUpperCase() +
                          item.account.name.slice(1)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="">
                  <td></td>
                  {totalIncome !== 0 && (
                    <>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold text-gray-700">
                        Total Income
                      </td>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400 py-4 px-6 font-bold  text-gray-700">
                        {currencySymbol} {totalIncome}
                        {/* dollar Sign */}
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  <td></td>

                  {totalOutcome !== 0 && (
                    <>
                      <td className="rounded-2xl shadow-lg border-b bg-orange-400  py-4 px-6 font-bold text-gray-700">
                        Total Outcome
                      </td>
                      <td className="rounded-2xl shadow-lg border-b  bg-orange-400 py-4 px-6 font-bold  text-gray-700">
                        {currencySymbol} {totalOutcome}
                        {/* dollar Sign */}
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
            <div className="h-16"></div>
          </>
        ) : (
          <div className="font-bold text-1xl px-5">No datas found!</div>
        )}
      </div>
      <Snackbar
        message={snackbarMessage}
        show={showSnackbar}
        onClose={handleSnackbarClose}
      />
      <div className="fixed bottom-6 right-2 sm:bottom-10 sm:right-10">
        <Link
          href={"/entry/addEditEntry"}
          className="rounded-xl shadow-lg bg-teal-100 hover:bg-teal-400  font-bold py-4 px-6  "
        >
          Add New Entry
        </Link>
      </div>
    </>
  );
}
