"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchTotalBalance, fetchMonthData } from "@/redux/slices/homeSlice";
import PieChart from "@/components/pieChart";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { currencySymbol } from "../currency";
import EChartBar from "@/components/EChartBar";
import {
  selectTotalBalance,
  selectIncomeList,
  selectOutcomeList,
  selectIncomeCategoryList,
  selectOutcomeCategoryList,
  selectIncomeCategoryCostList,
  selectOutcomeCategoryCostList,
  selectStatus,
  selectError,
} from "@/redux/selectors/homeSelectors";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import Joyride from "react-joyride";

export default function Home() {
  const dispatch = useDispatch();
  const totalBalance = useSelector(selectTotalBalance);
  const incomeList = useSelector(selectIncomeList);
  const outcomeList = useSelector(selectOutcomeList);
  const incomeCategoryList = useSelector(selectIncomeCategoryList);
  const outcomeCategoryList = useSelector(selectOutcomeCategoryList);
  const incomeCategoryCostList = useSelector(selectIncomeCategoryCostList);
  const outcomeCategoryCostList = useSelector(selectOutcomeCategoryCostList);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const [runTour, setRunTour] = useState(false);
  // const { open, message, severity } = useSelector((state) => state.snackbar);

  useEffect(() => {
    dispatch(fetchTotalBalance());
    dispatch(fetchMonthData());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      const hasSeenTour = localStorage.getItem("hasSeenAddNewTour");
      if (!hasSeenTour) {
        setRunTour(true);
        localStorage.setItem("hasSeenAddNewTour", "true");
      }
    }
  }, [status]);

  const date = new Date();
  const currentMonthName = date.toLocaleString("default", { month: "long" });

  const hasIncomeData = useMemo(
    () => incomeList && incomeList.length > 0,
    [incomeList]
  );
  const hasOutcomeData = useMemo(
    () => outcomeList && outcomeList.length > 0,
    [outcomeList]
  );
  const hasAnyData = useMemo(
    () => hasIncomeData || hasOutcomeData,
    [hasIncomeData, hasOutcomeData]
  );
  const memoIncomeList = useMemo(() => incomeList, [incomeList]);
  const memoOutcomeList = useMemo(() => outcomeList, [outcomeList]);
  const memoIncomeCategoryList = useMemo(
    () => incomeCategoryList,
    [incomeCategoryList]
  );
  const memoOutcomeCategoryList = useMemo(
    () => outcomeCategoryList,
    [outcomeCategoryList]
  );
  const memoIncomeCategoryCostList = useMemo(
    () => incomeCategoryCostList,
    [incomeCategoryCostList]
  );
  const memoOutcomeCategoryCostList = useMemo(
    () => outcomeCategoryCostList,
    [outcomeCategoryCostList]
  );

  return (
    <div className="p-5 mx-auto mt-14 sm:mt-0">
      <div className="text-3xl font-bold mb-5">Dashboard</div>
      <div>
        {/* Show Loading State */}
        {status === "loading" && <LoadingSpinner />}

        {/* Show UI only if data is successfully loaded */}
        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
              <div className="p-8 mb-1 text-2xl font-bold cursor-pointer shadow-lg rounded-2xl text-center content-center block max-w bg-teal-100 border border-gray-200 hover:bg-teal-200 h-32">
                Total Balance
                <br />
                <div>
                  {currencySymbol} {totalBalance}
                </div>
              </div>
              <Link href={"/entry/addEditEntry"}>
                <div className="add-new-button p-8 rounded-2xl text-center content-center block max-w bg-teal-100 shadow-lg hover:bg-teal-200 h-32">
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
                  {hasIncomeData && memoIncomeList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 mb-10 w-full">
                      <div className="sm:col-span-3 bd-white w-full overflow-x-auto">
                        <EChartBar
                          data={memoIncomeList}
                          title={["Income"]}
                          currency={currencySymbol}
                        />
                      </div>
                      {memoIncomeCategoryList &&
                        memoIncomeCategoryList.length > 0 && (
                          <div className="">
                            <PieChart
                              data={memoIncomeCategoryList}
                              cost={memoIncomeCategoryCostList}
                              currency={currencySymbol}
                            />
                          </div>
                        )}
                    </div>
                  )}

                  {hasOutcomeData && memoOutcomeList.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 mb-10 w-full">
                      <div className="sm:col-span-3 bd-white w-full overflow-x-auto">
                        <EChartBar
                          data={memoOutcomeList}
                          title={["Outcome"]}
                          currency={currencySymbol}
                        />
                      </div>
                      {memoOutcomeCategoryList &&
                        memoOutcomeCategoryList.length > 0 && (
                          <div className="">
                            <PieChart
                              data={memoOutcomeCategoryList}
                              cost={memoOutcomeCategoryCostList}
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
      <Joyride
        run={runTour}
        steps={[
          {
            target: ".add-new-button",
            content: "Click here to add a new entry!",
            placement: "top",
            disableBeacon: true,
          },
        ]}
        showSkipButton
        showProgress
        continuous
        locale={{
          last: "OK",
        }}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#14b8a6",
            backgroundColor: "#fff",
            textColor: "#333",
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped") {
            setRunTour(false);
          }
        }}
      />
    </div>
  );
}
