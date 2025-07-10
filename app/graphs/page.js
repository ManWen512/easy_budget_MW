"use client";

import PieChart from "@/components/pieChart";
import { useEffect, useMemo } from "react";
import {
  selectCurrency,
  selectTheme,
} from "@/redux/selectors/settingsSelectors";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMonthData,
  fetchYearData,
  fetchYearRangeData,
  setSelected,
} from "@/redux/slices/graphSlice";

import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import {
  selectIncomeList,
  selectOutcomeList,
  selectIncomeCategoryList,
  selectOutcomeCategoryList,
  selectIncomeCategoryCostList,
  selectOutcomeCategoryCostList,
  selectStatus,
  selectError,
  selectSelected,
} from "@/redux/selectors/graphSelectors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const EChartBar = dynamic(() => import("@/components/EChartBar"), {
  ssr: false,
});

const darkMuiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1f2937", // Tailwind gray-800
      default: "#111827", // Tailwind gray-900
    },
    text: {
      primary: "#fff",
    },
  },
});

const lightMuiTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function GraphsPage() {
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentstartYear = new Date().getFullYear() - 1;
  const selected = useSelector(selectSelected);

  const selectedOption = selected.selectedOption;
  const selectedMonth = selected.selectedMonth;
  const selectedYear = selected.selectedYear;
  const yearRange = selected.selectedYearRange;

  const incomeList = useSelector(selectIncomeList);
  const outcomeList = useSelector(selectOutcomeList);
  const incomeCategoryList = useSelector(selectIncomeCategoryList);
  const outcomeCategoryList = useSelector(selectOutcomeCategoryList);
  const incomeCategoryCostList = useSelector(selectIncomeCategoryCostList);
  const outcomeCategoryCostList = useSelector(selectOutcomeCategoryCostList);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const currencySymbol = useSelector(selectCurrency);
  const theme = useSelector(selectTheme);

  // Memoize chart data for rendering
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

  const years = Array.from({ length: 30 }, (_, i) => currentYear - i); // Generates a list of years from 2024 to 1995

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  const handleOptionChange = (option) => {
    dispatch(
      setSelected({
        selectedOption: option,
        selectedMonth: currentMonth,
        selectedYear: currentYear,
        selectedYearRange: {
          startYear: currentstartYear,
          endYear: currentYear,
        },
      })
    );
  };

  const handleMonthChange = (month) => {
    dispatch(setSelected({ selectedMonth: month }));
  };

  const handleYearChange = (year) => {
    dispatch(setSelected({ selectedYear: year }));
  };

  const handleYearRangeChange = (range) => {
    dispatch(setSelected({ selectedYearRange: range }));
  };

  // Fetch data when month and year are selected
  useEffect(() => {
    if (
      selected.selectedOption === "month" &&
      selected.selectedMonth &&
      selected.selectedYear
    ) {
      dispatch(
        fetchMonthData({
          year: selected.selectedYear,
          month: selected.selectedMonth,
        })
      );
    } else if (selected.selectedOption === "year" && selected.selectedYear) {
      dispatch(fetchYearData(selected.selectedYear));
    } else if (
      selected.selectedOption === "yearRange" &&
      selected.selectedYearRange.startYear &&
      selected.selectedYearRange.endYear
    ) {
      dispatch(fetchYearRangeData(selected.selectedYearRange));
    }
  }, [selected, dispatch]);

  return (
    <div className="p-5 mt-14 sm:mt-0">
      <div className="text-3xl font-bold mb-5 dark:text-white">Graphs</div>
      <div className="flex space-x-4 mb-4 w-full sm:w-[60vw]">
        {/* Radio Buttons */}
        <label
          className={`ml-3 font-bold shadow-lg relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "month"
              ? "border-l-4 border-teal-500 bg-teal-100"
              : "border-teal-400 dark:text-white"
          }`}
        >
          <input
            type="radio"
            name="dataOption"
            checked={selectedOption === "month"}
            className="sr-only peer"
            onChange={() => handleOptionChange("month")}
          />
          <span className="text-sm sm:text-base ">Select Month</span>
        </label>

        <label
          className={`ml-3 font-bold shadow-lg relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "year"
              ? "border-l-4 border-teal-500 bg-teal-100 "
              : "border-teal-400 dark:text-white"
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
              : "border-teal-400 dark:text-white"
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
                className="font-bold dark:text-white"
              >
                Month
              </InputLabel>
              <ThemeProvider
                theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
              >
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={selectedMonth || ""}
                  onChange={(e) => handleMonthChange(e.target.value)}
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
              </ThemeProvider>
            </FormControl>

            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold dark:text-white"
              >
                Year
              </InputLabel>
              <ThemeProvider
                theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
              >
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={selectedYear || ""}
                  onChange={(e) => handleYearChange(e.target.value)}
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
              </ThemeProvider>
            </FormControl>
          </div>
        )}

        {/* Year Selection */}
        {selectedOption === "year" && (
          <FormControl className="w-1/2 sm:w-1/4 p-3 rounded-md ">
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="font-bold  dark:text-white"
            >
              Year
            </InputLabel>
            <ThemeProvider
              theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
            >
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectedYear || ""}
                onChange={(e) => handleYearChange(e.target.value)}
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
            </ThemeProvider>
          </FormControl>
        )}

        {/* Year Range Selection */}
        {selectedOption === "yearRange" && (
          <div className="flex grid-cols-2 sm:flex-row gap-4 w-full">
            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold dark:text-white"
              >
                Start Year
              </InputLabel>
              <ThemeProvider
                theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
              >
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={yearRange.startYear || ""}
                  onChange={(e) =>
                    handleYearRangeChange({
                      ...yearRange,
                      startYear: e.target.value,
                    })
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
              </ThemeProvider>
            </FormControl>

            <FormControl className="w-full sm:w-1/4 p-3 rounded-md ">
              <InputLabel
                id="demo-simple-select-autowidth-label"
                className="font-bold dark:text-white"
              >
                End Year
              </InputLabel>
              <ThemeProvider
                theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
              >
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={yearRange.endYear || ""}
                  onChange={(e) =>
                    handleYearRangeChange({
                      ...yearRange,
                      endYear: e.target.value,
                    })
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
              </ThemeProvider>
            </FormControl>
          </div>
        )}
      </div>

      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          {((selectedOption === "month" && selectedMonth && selectedYear) ||
            (selectedOption === "year" && selectedYear) ||
            (selectedOption === "yearRange" &&
              yearRange.startYear &&
              yearRange.endYear)) && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 ">
              <div className="col-span-3 mt-0 sm:mt-5 ">
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
              <div className="-mt-10 sm:mt-10">
                <PieChart
                  data={memoIncomeCategoryList}
                  cost={memoIncomeCategoryCostList}
                  currency={currencySymbol}
                />
              </div>
              <div className="col-span-3 mt-10 sm:mt-10">
                <EChartBar
                  data={memoOutcomeList}
                  currency={currencySymbol}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  title={["Outcome"]}
                />
              </div>
              <div className="-mt-10 sm:mt-16">
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
