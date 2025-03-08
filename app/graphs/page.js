"use client";

import PieChart from "@/components/pieChart";
import BarChart from "@/components/barChart";
import { useState, useEffect } from "react";
import { currencySymbol } from "../currency";


export default function GraphsPage() {
  const [selectedOption, setSelectedOption] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearRange, setYearRange] = useState({
    startYear: null,
    endYear: null,
  });

  const [incomeCategoryList, setIncomeCategoryList] = useState([]);
  const [outcomeCategoryList, setOutcomeCategoryList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [outcomeList, setOutcomeList] = useState([]);
  const [incomeCategoryCostList, setIncomeCategoryCostList] = useState([]);
  const [outcomeCategoryCostList, setOutcomeCategoryCostList] = useState([]);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry/graphs`;


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
      fetchMonthData(selectedYear, selectedMonth);
    } else if (selectedYear) {
      fetchYearData(selectedYear);
    } else if (yearRange.startYear && yearRange.endYear) {
      fetchYearRangeData(yearRange);
    }
  }, [selectedMonth, selectedYear, yearRange]);

  const fetchMonthData = async (year, month) => {
    try {
      const response = await fetch(
        `${mainUrl}/month?year=${year}&month=${month}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      // Set the data for income and outcome category lists
      setIncomeCategoryList(
        transformData(data.incomeCategoryPercentageList || {})
      );
      setOutcomeCategoryList(
        transformData(data.outcomeCategoryPercentageList || {})
      );
      setIncomeList(transformDayData(data.incomeList || {}, year, month));
      setOutcomeList(transformDayData(data.outcomeList || {}, year, month));
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

  const fetchYearData = async (year) => {
    try {
      const response = await fetch(`${mainUrl}/year?year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      // Set the data for income and outcome category lists
      setIncomeCategoryList(
        transformData(data.incomeCategoryPercentageList || {})
      );
      setOutcomeCategoryList(
        transformData(data.outcomeCategoryPercentageList || {})
      );
      setIncomeList(transformMonthData(data.incomeList || {}));
      setOutcomeList(transformMonthData(data.outcomeList || {}));
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

  const fetchYearRangeData = async (year) => {
    try {
      const response = await fetch(
        `${mainUrl}/years?startYear=${year.startYear}&endYear=${year.endYear}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      // Set the data for income and outcome category lists
      setIncomeCategoryList(
        transformData(data.incomeCategoryPercentageList || {})
      );
      setOutcomeCategoryList(
        transformData(data.outcomeCategoryPercentageList || {})
      );
      setIncomeList(
        transformYearData(data.incomeList || {}, year.startYear, year.endYear)
      );
      setOutcomeList(
        transformYearData(data.outcomeList || {}, year.startYear, year.endYear)
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

  // Utility function to transform month data from object to array
  const transformMonthData = (dataObject) => {
    // Define month names using Date to get dynamic month names
    const monthNames = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(0, i); // Month index is 0-based (January is 0)
      return date.toLocaleString("default", { month: "long" }).toUpperCase(); // Convert to uppercase
    });

    return monthNames.map((month, index) => {
      const total = dataObject[month] || 0; // Get total for month or default to 0
      return { day: month, total };
    });
  };

  // Utility function to transform year data from object to array
  const transformYearData = (dataObject, startYear, endYear) => {
    const yearsArray = [];

    // Iterate through the range of years from startYear to endYear
    for (let year = startYear; year <= endYear; year++) {
      const total = dataObject[year] || 0; // Get total for year or default to 0
      yearsArray.push({ day: year, total }); // Push into the array
    }

    return yearsArray;
  };

  return (
    <>
      <div className="flex space-x-4 mb-4 p-5 mt-14 w-screen sm:w-[60vw]">
        {/* Checkboxes for selecting Month, Year, or Year Range */}
        <label
          className={`ml-3 w-full font-bold shadow-lg  relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "month"
              ? "border-l-4 border-teal-500 bg-teal-100 "
              : "border-teal-400"
          }`}
        >
          <input
            type="radio"
            name="dataOption"
            checked={selectedOption === "month"}
            className="sr-only peer "
            onChange={() => handleOptionChange("month")}
          />
          <span className="text-sm sm:text-base">Select Month</span>
        </label>

        <label
          className={`ml-3 w-full font-bold shadow-lg  relative cursor-pointer p-3 border rounded-lg transition-all ${
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
          className={`ml-3 w-full font-bold shadow-lg  relative cursor-pointer p-3 border rounded-lg transition-all ${
            selectedOption === "yearRange"
              ? " bg-teal-100 border-l-4 border-teal-500"
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
          <span className="text-sm sm:text-base">Select Year Range</span>
        </label>
      </div>

      <div className="flex space-x-4 mb-8 px-5">
        {/* Dropdowns for Month and Year Selection */}
        {selectedOption === "month" && (
          <>
            <div>
              <label htmlFor="month" className="mr-2">
                Month:
              </label>
              <select
                id="month"
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="mr-2">
                Year:
              </label>
              <select
                id="year"
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
              >
                <option value="" disabled>
                  Select Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Dropdown for Year Selection */}
        {selectedOption === "year" && (
          <div>
            <label htmlFor="year" className="mr-2">
              Year:
            </label>
            <select
              id="year"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
            >
              <option value="" disabled>
                Select Year
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dropdowns for Year Range Selection */}
        {selectedOption === "yearRange" && (
          <div className="flex space-x-2">
            <div>
              <label htmlFor="startYear" className="mr-2">
                Start Year:
              </label>
              <select
                id="startYear"
                value={yearRange.startYear || ""}
                onChange={(e) =>
                  setYearRange({ ...yearRange, startYear: e.target.value })
                }
                className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
              >
                <option value="" disabled>
                  Select Start Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="endYear" className="mr-2">
                End Year:
              </label>
              <select
                id="endYear"
                value={yearRange.endYear || ""}
                onChange={(e) =>
                  setYearRange({ ...yearRange, endYear: e.target.value })
                }
                className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
              >
                <option value="" disabled>
                  Select End Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {((selectedOption === "month" && selectedMonth && selectedYear) ||
        (selectedOption === "year" && selectedYear) ||
        (selectedOption === "yearRange" &&
          yearRange.startYear &&
          yearRange.endYear)) && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5">
          <div className="col-span-3 mt-20 ">
            <div>Income</div>
            <BarChart
              data={incomeList}
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
              data={incomeCategoryList}
              cost={incomeCategoryCostList}
              currency={currencySymbol}
            />
          </div>
          <div className="col-span-3 mt-20">
            <div>Outcome</div>
            <BarChart
              data={outcomeList}
              currency={currencySymbol}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              title={["Outcome"]}
            />
          </div>
          <div className="mt-20">
            <PieChart
              data={outcomeCategoryList}
              cost={outcomeCategoryCostList}
              currency={currencySymbol}
            />
          </div>
        </div>
      )}
    </>
  );
}
