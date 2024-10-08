"use client";

import { useState, useEffect } from "react";
import Home from "../page";

export default function HistoryPage() {
  const [type, setType] = useState("");
  const [account, setAccount] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("dateTime"); // Single state for sort option
  const [accountsData, setAccountsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [entryData, setEntryData] = useState([]); // State to hold entry data
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  useEffect(() => {
    fetchAccountsandCategories();
  }, []);

  useEffect(() => {
    if (account) {
      fetchEntryData();
    }
  }, [type, account, category, startDate, endDate, sortOption]);

  const fetchAccountsandCategories = async () => {
    const response = await fetch(`${mainUrl}/account/all`);
    const data = await response.json();
    const response1 = await fetch(`${mainUrl}/category/all`);
    const data1 = await response1.json();
    setAccountsData(data);
    setCategoriesData(data1);
  };

  const fetchEntryData = async () => {
    // Build the query parameters based on selected filters
    const params = new URLSearchParams();
    if (type) params.append("type", type.toUpperCase());
    if (account) params.append("accountId", account);
    if (category) params.append("categoryId", category);
    if (startDate) params.append("startDate", new Date(startDate).toISOString());
    if (endDate) params.append("endDate", new Date(endDate).toISOString());
    params.append("sortField", sortOption);
    params.append("sortOrder", sortOption === "ascending" ? "ASC" : "DESC");
    console.log([params])
    try {
      const response = await fetch(`${mainUrl}/entry/history?${params}`);
      const data = await response.json();
      setEntryData(data); // Store fetched entry data
      
    } catch (error) {
      console.error("Error fetching entry data:", error);
    }
  };



  return (
    <Home>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="appearance-none border-none p-2 bg-transparent"
              >
                <option>Type</option>
                <option value="INCOME">Income</option>
                <option value="OUTCOME">Outcome</option>
              </select>
            </th>

            <th className="p-2">
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="appearance-none border-none p-2 bg-transparent"
              >
                <option value="">Account</option>
                {accountsData.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </th>

            <th className="p-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none border-none p-2 bg-transparent"
              >
                <option value="">Category</option>
                {categoriesData.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </th>

            <th className="p-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ascending"
                  checked={sortOption === "ascending"}
                  onChange={() => setSortOption("ascending")}
                  className="form-radio"
                />
                <span className="ml-2">Ascending</span>
              </label>
            </th>
            <th>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="descending"
                  checked={sortOption === "descending"}
                  onChange={() => setSortOption("descending")}
                  className="form-radio"
                />
                <span className="ml-2">Descending</span>
              </label>
            </th>
            <th>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="dateTime"
                  checked={sortOption === "dateTime"}
                  onChange={() => setSortOption("dateTime")}
                  className="form-radio"
                />
                <span className="ml-2">DateTime</span>
              </label>
            </th>
          </tr>
        </thead>
      </table>

      {/* Date Range Pickers - Conditionally Rendered */}
      {sortOption === "dateTime" && (
        <div className="flex justify-end space-x-2 mt-4">
          <div className="mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mt-3">To</div>
          <div className="mb-4">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        </div>
      )}

      {/* Display Entry Data */}
      <div className="mt-4">
        {entryData.length > 0 ? (
          <ul>
            {entryData.map((entry) => (
              <li key={entry.id} className="border-b py-2">
                {/* Customize how you want to display entry details */}
                <div>{entry.tyoe}{entry.account.name}{entry.category.name}</div>
                <span>{entry.description}</span> - <span>{entry.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries found for the selected filters.</p>
        )}
      </div>
    </Home>
  );
}
