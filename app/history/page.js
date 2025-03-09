"use client";

import { useState, useEffect, useRef } from "react";
import { FaSortDown } from "react-icons/fa";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { currencySymbol } from "../currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountsAndCategories, fetchEntryData } from "@/redux/slices/historySlice";

export default function HistoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { accountsData, categoriesData, entryData, totalCost, loading } = useSelector((state) => state.history);

  // UI State
  const [type, setType] = useState(searchParams.get("type") || "");
  const [account, setAccount] = useState(searchParams.get("account") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || new Date().toISOString().split("T")[0]);
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "DESC");
  const [sortField, setSortField] = useState(searchParams.get("sortField") || "dateTime");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAccountsAndCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEntryData({ type, account, category, startDate, endDate, sortField, sortOrder }));
  }, [dispatch, type, account, category, startDate, endDate, sortField, sortOrder]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
  };

  const handleRowClick = (id) => {
    router.push(`/monthEntry/${id}`);
  };

  return (
    <>
      <div className="p-5 mt-14  ">
        <div className="text-center text-xl font-bold">History</div>
        <div className="flex pt-4 sm:items-center space-x-4 mb-4 w-[90vw]  sm:w-[60vw] ">
          {/* Filter Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex bg-orange-400 px-4 py-2 rounded-md z-10"
            >
              Filter
              <FaSortDown className="ml-1" />
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute mt-2 w-64 bg-teal-100 border border-gray-900 rounded-md shadow-lg p-4 ">
                <div className="mb-4">
                  <label className="block  mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="ALL">Type</option>
                    <option value="INCOME">Income</option>
                    <option value="OUTCOME">Outcome</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Account</label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Account</option>
                    {accountsData.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block  mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Category</option>
                    {categoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block  mb-2">Sort Field</label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="dateTime">DateTime</option>
                    <option value="cost">Cost</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sort Button with Ascending and Descending Arrows */}
          <div className="flex sm:items-center h-10">
            <button
              onClick={() =>
                setSortOrder(
                  sortOrder === "ascending" ? "descending" : "ascending"
                )
              }
              className="bg-orange-400 px-4 py-2 rounded-md flex items-center space-x-1"
            >
              <span>Sort</span>
              {sortOrder === "ascending" ? (
                <FaArrowUpShortWide className="ml-1" />
              ) : (
                <FaArrowDownWideShort className="ml-1" />
              )}
            </button>
          </div>

          {/* Date Range Pickers */}
          <div className="sm:flex items-center space-x-2   ">
            <div className="ml-2 ">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className=" rounded-md p-2 w-36 h-10 bg-orange-400"
              />
            </div>
            <div className=" text-sm">To</div>
            <div className="mb-4 sm:mt-4">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className=" rounded-md p-2 h-10 bg-orange-400"
               
              />
            </div>
          </div>
        </div>
        <div className="mt-4 w-[90vw] sm:w-[80vw] sm:-ml-36">
          {loading ? (
          <div className="flex space-x-2 justify-center items-center h-screen">
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          </div>
        ) : entryData.length > 0 ? (
            <table className=" max-w block overflow-x-auto lg:overflow-hidden border-separate border-spacing-2 -z-10">
              <thead className=" bg-teal-100 text-left text-xs font-semibold  uppercase tracking-wider border-b">
                <tr className="">
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Date</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Category</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Cost</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Card</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Type</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Card Balance</th>
                  <th className="border-l-4 border-teal-500 rounded-xl shadow-lg py-3 px-10 ">Description</th>
                </tr>
              </thead>
              <tbody>
                {entryData.map((entry) => (
                  <tr
                    key={entry.id}
                    className=" border-b cursor-pointer hover:bg-teal-100"
                    onClick={() => handleRowClick(entry.id)}
                  >
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                      {new Date(entry.dateTime).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      {/* Format the date as needed */}
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                      {entry.category.name}
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                      {currencySymbol} {entry.cost}
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                      {entry.account.name}
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm  items-center">
                      <span
                        className={`inline-block px-3 py-2 text-xs text-white rounded-full ${
                          entry.type === "INCOME"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                     {currencySymbol} {entry.account.balance}
                    </td>
                    <td className="rounded-2xl py-4 px-6 text-sm ">
                      {entry.description}
                    </td>
                  </tr>

                  
                ))} 

                <tr >
                  <td></td>
                  <td className="rounded-2xl py-4 px-6 text-sm border-b bg-orange-400 font-bold">Total Cost</td>
                  <td className="rounded-2xl py-4 px-6 text-sm border-b bg-orange-400 font-bold">{totalCost}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No entries found for the selected filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
