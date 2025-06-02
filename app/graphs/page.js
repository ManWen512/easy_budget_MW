"use client";

import PieChart from "@/components/pieChart";
import { useState, useEffect } from "react";
import { currencySymbol } from "../currency";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMonthData,
  fetchYearData,
  fetchYearRangeData,
} from "@/redux/slices/graphSlice";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const EChartBar = dynamic(() => import("@/components/EChartBar"), { ssr: false });

export default function GraphsPage() {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearRange, setYearRange] = useState({
    startYear: null,
    endYear: null,
  });

  const {
    incomeList,
    outcomeList,
    incomeCategoryList,
    outcomeCategoryList,
    incomeCategoryCostList,
    outcomeCategoryCostList,
  } = useSelector((state) => state.graph);

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
      dispatch(fetchMonthData({ year: selectedYear, month: selectedMonth }));
    } else if (selectedYear) {
      dispatch(fetchYearData(selectedYear));
    } else if (yearRange.startYear && yearRange.endYear) {
      dispatch(fetchYearRangeData(yearRange));
    }
  }, [selectedMonth, selectedYear, yearRange]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-5 mt-14"
    >
      <motion.div 
        className="flex space-x-4 mb-4 w-full sm:w-[60vw]"
        variants={itemVariants}
      >
        {/* Radio Buttons */}
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.label>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.label>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.label>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedOption}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex  mb-8 px-5 "
        >
          {/* Month and Year Selection */}
          {selectedOption === "month" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex grid-cols-2 sm:flex-row gap-4 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <label htmlFor="month" className="hidden sm:block mr-2 whitespace-nowrap">
                  Month:
                </label>
                <select
                  id="month"
                  value={selectedMonth || ""}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100 w-full sm:w-auto"
                >
                  <option value="" disabled>Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <label htmlFor="year" className="hidden sm:block mr-2 whitespace-nowrap">
                  Year:
                </label>
                <select
                  id="year"
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100 w-full sm:w-auto"
                >
                  <option value="" disabled>Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </motion.div>
            </motion.div>
          )}

          {/* Year Selection */}
          {selectedOption === "year" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center"
            >
              <label htmlFor="year" className="mr-2">
                Year:
              </label>
              <select
                id="year"
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100"
              >
                <option value="" disabled>Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Year Range Selection */}
          {selectedOption === "yearRange" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex grid-cols-2 sm:flex-row gap-4 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <label htmlFor="startYear" className="hidden sm:block mr-2 whitespace-nowrap">
                  Start Year:
                </label>
                <select
                  id="startYear"
                  value={yearRange.startYear || ""}
                  onChange={(e) => setYearRange({ ...yearRange, startYear: e.target.value })}
                  className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100 w-full sm:w-auto"
                >
                  <option value="" disabled>Select Start Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center"
              >
                <label htmlFor="endYear" className="hidden sm:block mr-2 whitespace-nowrap">
                  End Year:
                </label>
                <select
                  id="endYear"
                  value={yearRange.endYear || ""}
                  onChange={(e) => setYearRange({ ...yearRange, endYear: e.target.value })}
                  className="border-l-4 border-teal-500 rounded-md shadow-lg p-2 bg-teal-100 w-full "
                >
                  <option value="" disabled>Select End Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {((selectedOption === "month" && selectedMonth && selectedYear) ||
        (selectedOption === "year" && selectedYear) ||
        (selectedOption === "yearRange" &&
          yearRange.startYear &&
          yearRange.endYear)) && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5">
          <div className="col-span-3 mt-20 ">
            <div>Income</div>
            <EChartBar
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
            <EChartBar
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
    </motion.div>
  );
}
