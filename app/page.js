"use client";

import BarChart from "@/components/barChart";
import PieChart from "@/components/pieChart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ children }) {
  const [incomeList, setIncomeList] = useState([]);
  const [outcomeList, setOutcomeList] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [incomeCategoryList, setIncomeCategoryList] = useState([]);
  const [outcomeCategoryList, setOutcomeCategoryList] = useState([]);
  const [incomeCategoryCostList, setIncomeCategoryCostList] = useState([]);
  const [outcomeCategoryCostList, setOutcomeCategoryCostList] = useState([]);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const pathname = usePathname();

  const date = new Date();
  const currentMonthName = date.toLocaleString("default", { month: "long" });

  useEffect(() => {
    fetchTotalBalance();
    fetchMonthData();
  }, []);

  const fetchTotalBalance = async () => {
    const response = await fetch(`${mainUrl}/account/totalBalance`);
    const data = await response.json();
    setTotalBalance(data);
  };

  const fetchMonthData = async () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    try {
      const response = await fetch(
        `${mainUrl}/entry/graphs/month?year=${currentYear}&month=${currentMonth}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      // Set the data for income and outcome category lists
      setIncomeList(
        transformDayData(data.incomeList || {}, currentYear, currentMonth)
      );
      setOutcomeList(
        transformDayData(data.outcomeList || {}, currentYear, currentMonth)
      );
      setIncomeCategoryList(
        transformData(data.incomeCategoryPercentageList || {})
      );
      setOutcomeCategoryList(
        transformData(data.outcomeCategoryPercentageList || {})
      );
      setIncomeCategoryCostList(
        transformCostData(data.incomeCategoryCostList || {})
      );
      setOutcomeCategoryCostList(
        transformCostData(data.outcomeCategoryCostList || {})
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Utility function to transform data from object to array
  const transformCostData = (dataObject) => {
    return Object.entries(dataObject).map(([name, total]) => ({
      name,
      total,
    }));
  };

  // Utility function to transform data from object to array
  const transformData = (dataObject) => {
    return Object.entries(dataObject).map(([name, percentage]) => ({
      name,
      percentage,
    }));
  };

  const transformDayData = (dataObject, year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the specified month

    // Create an array with all days of the month, defaulting to 0 if no data exists for that day
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1; // Day number (1-based)
      const total = dataObject[day] || 0; // Use the total from the data object or default to 0

      return { day, total };
    });

    return daysArray;
  };

  return (
    <div className="flex min-h-screen">
      <div className=" flex flex-col bg-amber-900 border-r-2 border-black w-1/5 min-h-screen">
        <div className="fixed">
          <div className="flex items-center p-3">
            <div className="bg-black w-14 h-14 rounded-full mr-5"></div>
            <div className="text-3xl text-white font-bold">
              Easy <br></br>Budget
            </div>
          </div>
          <div className="flex flex-col items-center space-y-5 text-xl p-5">
            <div>
              <Link
                href={"/"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                  (pathname === "/" ? "bg-amber-600 font-bold" : "")
                }
              >
                Dashboard
              </Link>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/balance",
                }}
                // query: {
                //   totalBalance: totalBalance,
                // }
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                  (pathname === "/balance" ? "bg-amber-600 font-bold" : "")
                }
              >
                Balance
              </Link>
            </div>
            <div>
              <Link
                href={"/category"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                  (pathname === "/category" ? "bg-amber-600 font-bold" : "")
                }
              >
                Categories
              </Link>
            </div>
            <div>
              <Link
                href={"/graphs"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                  (pathname === "/graphs" ? "bg-amber-600 font-bold" : "")
                }
              >
                Graphs
              </Link>
            </div>
            <div>
              <Link
                href={"/monthEntry"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-5 py-2  text-white hover:text-black " +
                  (pathname === "/monthEntry" ? "bg-amber-600 font-bold" : "")
                }
              >
                Month Entry
              </Link>
            </div>
            <div>
              <Link
                href={"/history"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                  (pathname === "/history" ? "bg-amber-600 font-bold" : "")
                }
              >
                History
              </Link>
            </div>
            <div>
              <Link
                href={"/setting"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-amber-400 rounded-xl px-7 py-2 text-white hover:text-black " +
                  (pathname === "/setting" ? "bg-amber-600 font-bold" : "")
                }
              >
                Setting
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className=" p-5 bg-yellow-300 	h-auto w-screen ">
        {children ? (
          children
        ) : (
          <div className="container content-center">
            <div className="grid grid-cols-2 gap-4 ">
              <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200  shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
                <div className="mb-2 text-2xl font-bold text-white">
                  Total Balance
                </div>
                <br></br>
                <div className="mb-2 text-3xl font-bold text-white">
                  $ {totalBalance}
                </div>
              </div>
              <Link href={"/entry/addEditEntry"}>
                <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200  shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
                  <div className="mb-2 text-2xl font-bold text-white">
                    Add New
                  </div>
                </div>
              </Link>
            </div>

            <div className="">
              <div className="m-2 font-bold ">
                Overview ({currentMonthName})
              </div>
              <div className='grid grid-cols-4'>
                <div className="col-span-3 bd-white">
                  <BarChart data={incomeList} title={["Income"]} />
                </div>
                <div className=" mt-20">
                  <PieChart
                    data={incomeCategoryList}
                    cost={incomeCategoryCostList}
                  />
                </div>
                <div className="col-span-3 bd-white">
                  <BarChart data={outcomeList} title={["Outcome"]} />
                </div>
                <div className=" mt-20">
                  <PieChart
                    data={outcomeCategoryList}
                    cost={outcomeCategoryCostList}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
