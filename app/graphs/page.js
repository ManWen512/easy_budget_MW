"use client";

import PieChart from "@/components/pieChart";
import Home from "../page";
import BarChart from "@/components/barChart";
import { useState, useEffect } from "react";

export default function graphsPage() {
  const [isMonthChecked, setIsMonthChecked] = useState(false);
  const [isYearChecked, setIsYearChecked] = useState(false);
  const [isYearRangeChecked, setIsYearRangeChecked] = useState(false);

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
  const years = Array.from({ length: 30 }, (_, i) => 2024 - i); // Generates a list of years from 2024 to 1995

  // Handle checkbox change with mutual exclusion
  const handleCheckboxChange = (checkboxType) => {
    if (checkboxType === "month") {
      setIsMonthChecked(true);
      setIsYearChecked(false);
      setIsYearRangeChecked(false);
    } else if (checkboxType === "year") {
      setIsMonthChecked(false);
      setIsYearChecked(true);
      setIsYearRangeChecked(false);
    } else if (checkboxType === "yearRange") {
      setIsMonthChecked(false);
      setIsYearChecked(false);
      setIsYearRangeChecked(true);
    }
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
      setIncomeCategoryList(transformData(data.incomeCategoryList || {}));
      setOutcomeCategoryList(transformData(data.outcomeCategoryList || {}));
      setIncomeList(transformDayData(data.incomeList || {}));
      setOutcomeList(transformDayData(data.outcomeList || {}));
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
      setIncomeCategoryList(transformData(data.incomeCategoryList || {}));
      setOutcomeCategoryList(transformData(data.outcomeCategoryList || {}));
      setIncomeList(transformDayData(data.incomeList || {}));
      setOutcomeList(transformDayData(data.outcomeList || {}));
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
      setIncomeCategoryList(transformData(data.incomeCategoryList || {}));
      setOutcomeCategoryList(transformData(data.outcomeCategoryList || {}));
      setIncomeList(transformDayData(data.incomeList || {}));
      setOutcomeList(transformDayData(data.outcomeList || {}));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Utility function to transform data from object to array
  const transformData = (dataObject) => {
    return Object.entries(dataObject).map(([name, percentage]) => ({
      name,
      percentage,
    }));
  };

  // Utility function to transform day data from object to array
  const transformDayData = (dataObject) => {
    return Object.entries(dataObject).map(([day, total]) => ({
      day,
      total,
    }));
  };

  return (
    <Home>
      <div className="flex space-x-4 mb-4">
        {/* Checkboxes for selecting Month, Year, or Year Range */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isMonthChecked}
            onChange={() => handleCheckboxChange("month")}
          />
          <span>Select Month</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isYearChecked}
            onChange={() => handleCheckboxChange("year")}
          />
          <span>Select Year</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isYearRangeChecked}
            onChange={() => handleCheckboxChange("yearRange")}
          />
          <span>Select Year Range</span>
        </label>
      </div>

      <div className="flex space-x-4 mb-8">
        {/* Dropdowns for Month and Year Selection */}
        {isMonthChecked && (
          <>
            <div>
              <label htmlFor="month" className="mr-2">
                Month:
              </label>
              <select
                id="month"
                value={selectedMonth || ""}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
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
                className="border border-gray-300 rounded-md p-2"
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
        {isYearChecked && (
          <div>
            <label htmlFor="year" className="mr-2">
              Year:
            </label>
            <select
              id="year"
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
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
        {isYearRangeChecked && (
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
                className="border border-gray-300 rounded-md p-2"
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
                className="border border-gray-300 rounded-md p-2"
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

      {isMonthChecked && (
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-20">
            <div>Income</div>
            <BarChart
              data={incomeList}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              title={["Income"]}
            />
          </div>
          <div>
            <PieChart data={incomeCategoryList} />
          </div>
          <div className="mt-20">
            <BarChart
              data={outcomeList}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              title={["Outcome"]}
            />
          </div>
          <div>
            <PieChart data={outcomeCategoryList} />
          </div>
        </div>
      )}
      {isYearChecked && (
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-20">
            <div>Income</div>
            <BarChart data={incomeList} title={["Income"]} />
          </div>
          <div>
            <PieChart data={incomeCategoryList} />
          </div>
          <div className="mt-20">
            <BarChart data={outcomeList} title={["Outcome"]} />
          </div>
          <div>
            <PieChart data={outcomeCategoryList} />
          </div>
        </div>
      )}

      {isYearRangeChecked && (
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-20">
            <div>Income</div>
            <BarChart data={incomeList} title={["Income"]} />
          </div>
          <div>
            <PieChart data={incomeCategoryList} />
          </div>
          <div className="mt-20">
            <BarChart data={outcomeList} title={["Outcome"]} />
          </div>
          <div>
            <PieChart data={outcomeCategoryList} />
          </div>
        </div>
      )}
    </Home>
  );
}
