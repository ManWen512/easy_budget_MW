"use client";

import PieChart from "@/components/pieChart";
import { useState, useEffect, useMemo } from "react";
import { currencySymbol } from "../currency";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMonthData,
  fetchYearData,
  fetchYearRangeData,
} from "@/redux/slices/graphSlice";

import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { showSnackbar, closeSnackbar } from "@/redux/slices/snackBarSlice";
import {
  selectIncomeList,
  selectOutcomeList,
  selectIncomeCategoryList,
  selectOutcomeCategoryList,
  selectIncomeCategoryCostList,
  selectOutcomeCategoryCostList,
  selectStatus,
  selectError,
} from "@/redux/selectors/graphSelectors";

const EChartBar = dynamic(() => import("@/components/EChartBar"), {
  ssr: false,
});

export default function GraphsPage() {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearRange, setYearRange] = useState({
    startYear: null,
    endYear: null,
  });

  const incomeList = useSelector(selectIncomeList);
  const outcomeList = useSelector(selectOutcomeList);
  const incomeCategoryList = useSelector(selectIncomeCategoryList);
  const outcomeCategoryList = useSelector(selectOutcomeCategoryList);
  const incomeCategoryCostList = useSelector(selectIncomeCategoryCostList);
  const outcomeCategoryCostList = useSelector(selectOutcomeCategoryCostList);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  // Memoize chart data for rendering
  const memoIncomeList = useMemo(() => incomeList, [incomeList]);
  const memoOutcomeList = useMemo(() => outcomeList, [outcomeList]);
  const memoIncomeCategoryList = useMemo(() => incomeCategoryList, [incomeCategoryList]);
  const memoOutcomeCategoryList = useMemo(() => outcomeCategoryList, [outcomeCategoryList]);
  const memoIncomeCategoryCostList = useMemo(() => incomeCategoryCostList, [incomeCategoryCostList]);
  const memoOutcomeCategoryCostList = useMemo(() => outcomeCategoryCostList, [outcomeCategoryCostList]);

  const months = [
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
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i); // Generates a list of years from 2024 to 1995

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    // Reset selected data when the option changes
    setSelectedMonth(null);
    setSelectedYear(null);
    setYearRange({ startYear: null, endYear: null });
  };

  // Fetch data when month and year are selected
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(fetchMonthData({ year: selectedYear, month: selectedMonth }));
    } else if (selectedYear) {
      dispatch(fetchYearData(selectedYear));
    } else if (yearRange.startYear && yearRange.endYear) {
      dispatch(fetchYearRangeData(yearRange));
    }
  }, [selectedMonth, selectedYear, yearRange]);

  return (
    <div className="p-5 mt-14">
      <div className="flex space-x-4 mb-4 w-full sm:w-[60vw]">
        {/* Radio Buttons */}
        <label
          className={`ml-3 font-bold shadow-lg relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "month"
              ? "border-l-4 border-teal-500 bg-teal-100"
              : "border-teal-400"
          }`}
        >
          <input
            type="radio"
            name="dataOption"
            checked={selectedOption === "month"}
            className="sr-only peer"
            onChange={() => handleOptionChange("month")}
          />
          <span className="text-sm sm:text-base">Select Month</span>
        </label>

        <label
          className={`ml-3 font-bold shadow-lg relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "year"
              ? "border-l-4 border-teal-500 bg-teal-100"
              : "border-teal-400"
          }`}
        >
          <input
            type="radio"
            name="dataOption"
            checked={selectedOption === "year"}
            className="sr-only peer"
            onChange={() => handleOptionChange("year")}
          />
          <span className="text-sm sm:text-base">Select Year</span>
        </label>

        <label
          className={`ml-3 font-bold shadow-lg relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "yearRange"
              ? "bg-teal-100 border-l-4 border-teal-500"
              : "border-teal-400"
          }`}
        >
          <input
            type="radio"
            name="dataOption"
            checked={selectedOption === "yearRange"}
            className="sr-only peer"
            onChange={() => handleOptionChange("yearRange")}
          />
          <span className="text-sm sm:text-base">Year Range</span>
        </label>
      </div>

      <div key={selectedOption} className="flex  mb-8 px-5 ">
        {/* Month and Year Selection */}
        {selectedOption === "month" && (
          <div className="flex flex-col-2 sm:flex-row gap-4 w-full">
            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold"
              >
                Month
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value)}
                autoWidth
                label="Month"
                name="month"
              >
                {months.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold"
              >
                Year
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(e.target.value)}
                autoWidth
                label="Year"
                name="year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Year Selection */}
        {selectedOption === "year" && (
          <FormControl className="w-1/2 sm:w-1/4 p-3 rounded-md ">
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="font-bold"
            >
              Year
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
              autoWidth
              label="Year"
              name="year"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Year Range Selection */}
        {selectedOption === "yearRange" && (
          <div className="flex grid-cols-2 sm:flex-row gap-4 w-full">
            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold"
              >
                Start Year
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={yearRange.startYear || ""}
                onChange={(e) =>
                  setYearRange({ ...yearRange, startYear: e.target.value })
                }
                autoWidth
                label="Start Year"
                name="startYear"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold"
              >
                End Year
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={yearRange.endYear || ""}
                onChange={(e) =>
                  setYearRange({ ...yearRange, endYear: e.target.value })
                }
                autoWidth
                label="End Year"
                name="endYear"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
      </div>

      
        <Snackbar
          open={open}
          onClose={() => dispatch(closeSnackbar())}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => dispatch(closeSnackbar())}
            severity={severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      
      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          {((selectedOption === "month" && selectedMonth && selectedYear) ||
            (selectedOption === "year" && selectedYear) ||
            (selectedOption === "yearRange" &&
              yearRange.startYear &&
              yearRange.endYear)) && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5">
              <div className="col-span-3 mt-20 ">
                <div>Income</div>
                <EChartBar
                  data={memoIncomeList}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  startYear={yearRange.startYear}
                  endYear={yearRange.endYear}
                  title={["Income"]}
                  currency={currencySymbol}
                />
              </div>
              <div className=" mt-20">
                <PieChart
                  data={memoIncomeCategoryList}
                  cost={memoIncomeCategoryCostList}
                  currency={currencySymbol}
                />
              </div>
              <div className="col-span-3 mt-20">
                <div>Outcome</div>
                <EChartBar
                  data={memoOutcomeList}
                  currency={currencySymbol}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  title={["Outcome"]}
                />
              </div>
              <div className="mt-20">
                <PieChart
                  data={memoOutcomeCategoryList}
                  cost={memoOutcomeCategoryCostList}
                  currency={currencySymbol}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
