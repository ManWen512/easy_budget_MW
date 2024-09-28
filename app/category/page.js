"use client";

import { useEffect, useState } from "react";
import Home from "../page";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/category`;

  const fetchCategories = async () => {
    const response = await fetch(`${mainUrl}/all`);
    const data = await response.json();
    setCategories(data);
  };

  // For first render
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${mainUrl}/${id}`, { method: "DELETE" });
    // setCategories((prevCategories) =>
    //   prevCategories.filter((category) => category.id !== id)
    // );
    fetchCategories();
  };

  return (
    <Home>
      <div>
        <h1 className="text-3xl mb-5">Categories</h1>
        <ul>
          {categories.map((item, index) => (
            <li
              className="flex justify-around items-center border-2 border-blue-400 rounded-xl m-5 p-3 space-x-5"
              key={item.id}
            >
              <p>{index + 1}.</p>
              <p>{item.name}</p>
              <button className="rounded-full p-2 bg-gray-400 hover:bg-gray-500">
                Edit
              </button>
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
    </Home>
  );
}
