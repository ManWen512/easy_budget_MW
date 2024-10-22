"use client";

import BarChart from "@/components/barChart";
import PieChart from "@/components/pieChart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currencySymbol } from "./currency";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdCategory,
} from "react-icons/md";
import { VscGraphScatter } from "react-icons/vsc";
import { IoCalendar } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import Image from "next/image";


export default function Home({ children }) {
  // const { currency } = useCurrency();
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
      <div className=" flex flex-col   shadow-2xl w-1/5 min-h-screen">
        <div className="fixed">
          <div className="flex items-center p-3   mb-3">
            <div className="">
              <Image src="/Pixel.png" width={50} height={50}/>
              
            </div>
            <div className="ml-2 text-2xl">
              EASY <br></br>BUDGET
            </div>
          </div>
          <div className="flex flex-col  space-y-5 text-xl p-2">
            <div>
              <Link
                href={"/"}
                // This is so cool react+tailwind combo
                className={
                  "hover:bg-teal-100 rounded-xl px-2 py-3 flex text-gray-600 " +
                  (pathname === "/"
                    ? "bg-teal-100  border-l-4 border-teal-500"
                    : "")
                }
              >
                <MdDashboard size={25} className="mt-1 mr-3" /> Dashboard
              </Link>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/balance",
                }}
                className={
                  "flex hover:bg-teal-100 rounded-xl px-2 py-3  text-gray-600 " +
                  (pathname === "/balance"
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : "")
                }
              >
                <MdAccountBalanceWallet size={25} className="mt-1 mr-3" />
                Balance
              </Link>
            </div>
            <div>
              <Link
                href={"/category"}
                // This is so cool react+tailwind combo
                className={
                  "flex hover:bg-teal-100 rounded-xl px-2 py-3  text-gray-600  " +
                  (pathname === "/category"
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : "")
                }
              >
                <MdCategory size={25} className="mt-1 mr-3" /> Categories
              </Link>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/graphs",
                }}
                // This is so cool react+tailwind combo
                className={
                  "flex hover:bg-teal-100 rounded-xl px-2 py-3 text-gray-600  " +
                  (pathname === "/graphs"
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : "")
                }
              >
                <VscGraphScatter size={25} className="mt-1 mr-3" />
                Graphs
              </Link>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/monthEntry",
                }}
                // This is so cool react+tailwind combo
                className={
                  "flex hover:bg-teal-100 rounded-xl px-2 py-3 text-gray-600  " +
                  (pathname === "/monthEntry"
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : "")
                }
              >
                <IoCalendar size={25} className="mt-1 mr-3" /> Month Entry
              </Link>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/history",
                }}
                // This is so cool react+tailwind combo
                className={
                  "flex hover:bg-teal-100 rounded-xl px-2 py-3 text-gray-600  " +
                  (pathname === "/history"
                    ? "bg-teal-100 border-l-4 border-teal-500"
                    : "")
                }
              >
                <LuHistory size={25} className="mt-1 mr-3" />
                History
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className=" p-5 	h-auto w-screen ">
        {children ? (
          children
        ) : (
          <div className="container content-center">
            <div className="grid grid-cols-2 gap-4 ">
              <div className="h-48 mb-2 text-2xl font-bold cursor-pointer shadow-lg rounded-2xl text-center content-center block max-w p-6 bg-teal-100 border border-gray-200   hover:bg-teal-200 ">
                Total Balance
                <br></br>
                <div>
                  {currencySymbol} {totalBalance}
                </div>
              </div>
              <Link href={"/entry/addEditEntry"}>
                <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-teal-100  shadow-lg hover:bg-teal-200">
                  <div className="mb-2 text-2xl font-bold ">Add New</div>
                </div>
              </Link>
            </div>

            <div className="">
              <div className="m-2 font-bold ">
                Overview ({currentMonthName})
              </div>
              <div className="grid grid-cols-4">
                <div className="col-span-3 bd-white">
                  <BarChart
                    data={incomeList}
                    title={["Income"]}
                    currency={currencySymbol}
                  />
                </div>
                <div className=" mt-20">
                  <PieChart
                    data={incomeCategoryList}
                    cost={incomeCategoryCostList}
                    currency={currencySymbol}
                  />
                </div>
                <div className="col-span-3 bd-white">
                  <BarChart
                    data={outcomeList}
                    title={["Outcome"]}
                    currency={currencySymbol}
                  />
                </div>
                <div className=" mt-20">
                  <PieChart
                    data={outcomeCategoryList}
                    cost={outcomeCategoryCostList}
                    currency={currencySymbol}
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
