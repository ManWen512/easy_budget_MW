"use client";

import { useState, useEffect, useRef } from "react";
import Home from "../page";
import { FaSortDown } from "react-icons/fa";
import { FaArrowDownWideShort, FaArrowUpShortWide } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { currencySymbol } from "../currency";

export default function HistoryPage() {
  const date = new Date();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [type, setType] = useState(searchParams.get("type") || "");
  const [account, setAccount] = useState(searchParams.get("account") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0));
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "DESC");
  const [sortField, setSortField] = useState(searchParams.get("sortField") || "dateTime");
  const [accountsData, setAccountsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [entryData, setEntryData] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const dropdownRef = useRef(null);
  // const { currency } = useCurrency();
  
  useEffect(() => {
    fetchAccountsandCategories();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchEntryData();
    updateQueryParams();
  }, [type, account, category, startDate, endDate, sortField, sortOrder]);

  const updateQueryParams = () => {
    
    const params = new URLSearchParams();

    if (type) params.set("type", type);
    if (account) params.set("account", account);
    if (category) params.set("category", category);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (sortField) params.set("sortField", sortField);
    if (sortOrder) params.set("sortOrder", sortOrder);

    const queryString = params.toString();
    router.replace(`/history?${queryString}`);
  };

  const fetchAccountsandCategories = async () => {
    const response = await fetch(`${mainUrl}/account/all`);
    const data = await response.json();
    const response1 = await fetch(`${mainUrl}/category/all`);
    const data1 = await response1.json();
    setAccountsData(data);
    setCategoriesData(data1);
  };

  const fetchEntryData = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (type && type !== "ALL") {
      params.append("type", type);
    }
    if (account) params.append("accountId", account);
    if (category) params.append("categoryId", category);
    if (startDate) params.append("startDate", formatDate(startDate));
    if (endDate) params.append("endDate", formatDate(endDate));
    if (sortField) params.append("sortField", sortField);
    if (sortOrder) params.append("sortOrder", sortOrder === "ascending" ? "ASC" : "DESC");

    const url = params.toString() ? `${mainUrl}/entry/history?${params}` : `${mainUrl}/entry/history`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setEntryData(data);
    } catch (error) {
      console.error("Error fetching entry data:", error);
    }finally{
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const handleRowClick = (id) => {
    router.push(`/monthEntry/${id}`);
  };
  return (
    <Home>
      <div>
        <div className="flex items-center space-x-4 mb-4">
          {/* Filter Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex bg-orange-300 px-4 py-2 rounded-md"
            >
              Filter
              <FaSortDown className="ml-1" />
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute mt-2 w-64 bg-teal-100 border border-gray-900 rounded-md shadow-lg p-4">
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
          <div className="flex items-center ">
            <button
              onClick={() =>
                setSortOrder(
                  sortOrder === "ascending" ? "descending" : "ascending"
                )
              }
              className="bg-orange-300 px-4 py-2 rounded-md flex items-center space-x-1"
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
          <div className="flex  items-center space-x-2 mt-4 ">
            <div className="mb-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className=" rounded-md p-2 bg-orange-300"
              />
            </div>
            <div className="mb-3">To</div>
            <div className="mb-4">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className=" rounded-md p-2 bg-orange-300"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          {isLoading ? (
          <div className="flex space-x-2 justify-center items-center h-screen">
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-6 w-4"></div>
            <div className="animate-bounce bg-teal-100 rounded-full h-8 w-4"></div>
          </div>
        ) : entryData.length > 0 ? (
            <table className="min-w-full border-separate border-spacing-2 ">
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
              </tbody>
            </table>
          ) : (
            <p>No entries found for the selected filters.</p>
          )}
        </div>
      </div>
    </Home>
  );
}
