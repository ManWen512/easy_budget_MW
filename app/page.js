"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchTotalBalance, fetchMonthData } from "@/redux/slices/homeSlice";
import BarChart from "@/components/barChart";
import PieChart from "@/components/pieChart";
import Link from "next/link";

import { useEffect } from "react";
import { currencySymbol } from "./currency";

export default function Home() {
  const dispatch = useDispatch();
  const {
    totalBalance,
    incomeList,
    outcomeList,
    incomeCategoryList,
    outcomeCategoryList,
    incomeCategoryCostList,
    outcomeCategoryCostList,
    status,
    error,
  } = useSelector((state) => state.home);

  console.log(status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTotalBalance());
      dispatch(fetchMonthData());
    }
  }, [dispatch, status]);

  const date = new Date();
  const currentMonthName = date.toLocaleString("default", { month: "long" });

  return (
    <div className=" p-5 	mx-auto mt-14">
      <div>
        {/* Show Loading State */}
        {status === "loading" && (
          <div className="flex space-x-2 justify-center items-center h-screen">
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          </div>
        )}

        {/* Show Error Message */}
        {status === "failed" && (
          <p className="text-center text-red-500 font-bold text-lg">
            Error: {error}
          </p>
        )}

        {/* Show UI only if data is successfully loaded */}
        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:mr-28 ">
              <div className="h-48 mb-1 text-2xl font-bold cursor-pointer shadow-lg rounded-2xl text-center content-center block max-w p-6 bg-teal-100 border border-gray-200   hover:bg-teal-200 ">
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

            <div className="mt-8">
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
                <div className=" sm:mt-20">
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
                <div className=" sm:mt-20">
                  <PieChart
                    data={outcomeCategoryList}
                    cost={outcomeCategoryCostList}
                    currency={currencySymbol}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
