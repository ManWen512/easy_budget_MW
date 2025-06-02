"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchTotalBalance, fetchMonthData } from "@/redux/slices/homeSlice";
import PieChart from "@/components/pieChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import Link from "next/link";

import { useEffect } from "react";
import { currencySymbol } from "./currency";
import EChartBar from "@/components/EChartBar";

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

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTotalBalance());
      dispatch(fetchMonthData());
    }
  }, [dispatch, status]);

  const handleRetry = () => {
    dispatch(fetchTotalBalance());
    dispatch(fetchMonthData());
  };

  const date = new Date();
  const currentMonthName = date.toLocaleString("default", { month: "long" });

  const hasIncomeData = incomeList && incomeList.length > 0;
  const hasOutcomeData = outcomeList && outcomeList.length > 0;
  const hasAnyData = hasIncomeData || hasOutcomeData;

  return (
    <div className="p-5 mx-auto mt-14">
      <div>
        {/* Show Loading State */}
        {status === "loading" && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Show Error Message */}
        {status === "failed" && (
          <div className="max-w-md mx-auto mt-8">
            <ErrorMessage
              message={error || "Something went wrong. Please try again."}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Show UI only if data is successfully loaded */}
        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:mr-28">
              <div className="h-48 mb-1 text-2xl font-bold cursor-pointer shadow-lg rounded-2xl text-center content-center block max-w p-6 bg-teal-100 border border-gray-200 hover:bg-teal-200">
                Total Balance
                <br />
                <div>
                  {currencySymbol} {totalBalance}
                </div>
              </div>
              <Link href={"/entry/addEditEntry"}>
                <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-teal-100 shadow-lg hover:bg-teal-200">
                  <div className="mb-2 text-2xl font-bold">Add New</div>
                </div>
              </Link>
            </div>

            <div className="mt-8">
              <div className="m-2 font-bold">
                Overview ({currentMonthName})
              </div>
              {!hasAnyData ? (
                <div className="text-center text-gray-500 mt-8">
                  No data available for this month. Add some entries to see your overview.
                </div>
              ) : (
                <>
                  {hasIncomeData && incomeList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 mb-10">
                      <div className="sm:col-span-3 bd-white">
                        <EChartBar
                          data={incomeList}
                          title={["Income"]}
                          currency={currencySymbol}
                        />
                      </div>
                      {incomeCategoryList && incomeCategoryList.length > 0 && (
                        <div className="sm:mt-20">
                          <PieChart
                            data={incomeCategoryList}
                            cost={incomeCategoryCostList}
                            currency={currencySymbol}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {hasOutcomeData && outcomeList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 mb-10">
                      <div className="sm:col-span-3 bd-white">
                        <EChartBar
                          data={outcomeList}
                          title={["Outcome"]}
                          currency={currencySymbol}
                        />
                      </div>
                      {outcomeCategoryList && outcomeCategoryList.length > 0 && (
                        <div className="sm:mt-20">
                          <PieChart
                            data={outcomeCategoryList}
                            cost={outcomeCategoryCostList}
                            currency={currencySymbol}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}