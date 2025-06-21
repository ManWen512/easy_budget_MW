"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchTotalBalance, fetchMonthData } from "@/redux/slices/homeSlice";
import PieChart from "@/components/pieChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { currencySymbol } from "./currency";
import EChartBar from "@/components/EChartBar";
import Snackbar from "@mui/material/Snackbar";

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
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTotalBalance());
      dispatch(fetchMonthData());
    }
  }, [dispatch, status]);

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
            <LoadingSpinner />
          </div>
        )}

        {/* Show Error Message */}
        {status === "failed" && (
          <Snackbar
            severity="error"
            message={error}
            open={showErrorSnackbar}
            onClose={() => setShowErrorSnackbar(false)}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          />
        )}

        {/* Show UI only if data is successfully loaded */}
        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
              <div className="p-8 mb-1 text-2xl font-bold cursor-pointer shadow-lg rounded-2xl text-center content-center block max-w bg-teal-100 border border-gray-200 hover:bg-teal-200">
                Total Balance
                <br />
                <div>
                  {currencySymbol} {totalBalance}
                </div>
              </div>
              <Link href={"/entry/addEditEntry"}>
                <div className="p-8 rounded-2xl text-center content-center block max-w bg-teal-100 shadow-lg hover:bg-teal-200">
                  <div className="mb-2 text-2xl font-bold">Add New</div>
                </div>
              </Link>
            </div>

            <div className="mt-8">
              <div className="m-2 font-bold">Overview ({currentMonthName})</div>
              {!hasAnyData ? (
                <div className="text-center text-gray-500 mt-8">
                  No data available for this month. Add some entries to see your
                  overview.
                </div>
              ) : (
                <>
                  {hasIncomeData && incomeList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 mb-10">
                      <div className="sm:col-span-3 bd-white w-full overflow-x-auto">
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
                      <div className="sm:col-span-3 bd-white w-full overflow-x-auto">
                        <EChartBar
                          data={outcomeList}
                          title={["Outcome"]}
                          currency={currencySymbol}
                        />
                      </div>
                      {outcomeCategoryList &&
                        outcomeCategoryList.length > 0 && (
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
