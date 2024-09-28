"use client";

import Home from "../page";
import { useEffect, useState } from "react";

export default function balancePage() {
  const [account, setAccount] = useState([]);
  const accUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/account`;

  const fetchAccounts = async () => {
    const response = await fetch(`${accUrl}/all`);
    const data = await response.json();
    setAccount(data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <Home>
      <div>
        <div className="mb-2 rounded-2xl text-center block w-1/2 p-6 bg-yellow-950 border border-gray-200 rounded-lg shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
          <div className="mb-20 text-2xl font-bold text-white">
            Total Balance
          </div>
          <div className="mb-2 text-3xl font-bold text-white">$ 1200</div>
        </div>
        <ul>
          {account.map((acc, index) => (
            <li key={acc.id}>
              <div className="rounded-2xl text-center block w-1/2 p-6 bg-yellow-950 border border-gray-200 rounded-lg shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
                <div className="grid grid-cols-2 gap-4 text-1xl  text-white">
                  <div>KBZ</div>
                  <div className="font-bold">$ 1000</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Home>
  );
}
