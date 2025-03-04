"use client";

import { useEffect, useState } from "react";
import Home from "../page";
import Link from "next/link";

export default function EntryPage() {
  const [entries, setEntries] = useState([]);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/entry`;

  const fetchEntries = async () => {
    const response = await fetch(`${mainUrl}/all`);
    const data = await response.json();
    setEntries(data);
  };

  // For first render
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${mainUrl}/${id}`, { method: "DELETE" });
    // setEntries((prevEntries) =>
    //   prevEntries.filter((category) => category.id !== id)
    // );
    fetchEntries();
  };

  return (
    <>
      <div>
        <h1 className="text-3xl mb-5">Entries</h1>
        <ul>
          {entries.map((item, index) => (
            <li
              className="flex justify-around items-center border-2 border-blue-400 rounded-xl m-5 p-3 space-x-5"
              key={item.id}
            >
              <p>{index + 1}.</p>
              <p>{item.type}</p>
              <p>
                {item.account.name.charAt(0).toUpperCase() +
                  item.account.name.slice(1)}
              </p>
              <p>{item.category.name}</p>
              <p>{item.cost}</p>
              <p>{item.dateTime}</p>
              <p>{item.description}</p>
              <Link
                href={{
                  pathname: "/entry/addEditEntry",
                  query: {
                    itemId: item.id,
                    type: item.type,
                    category: JSON.stringify(item.category),
                    balance: JSON.stringify(item.account),
                    cost: item.cost,
                    dateTime: item.dateTime,
                    description: item.description,
                  },
                }}
              >
                <button className="rounded-full p-2 bg-gray-400 hover:bg-gray-500">
                  Edit
                </button>
              </Link>
              <button
                className=" rounded-full p-2 bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link
          href={"/entry/addEditEntry"}
          className="rounded-full p-2 bg-green-500 hover:bg-green-700"
        >
          Add New Entry
        </Link>
      </div>
    </>
  );
}
