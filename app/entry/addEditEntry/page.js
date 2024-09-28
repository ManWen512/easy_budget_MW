"use client";

import { useRouter } from "next/navigation";
import Home from "../../page";
import { useEffect, useState } from "react";

// only "searchParams" works, name cannot be changed
export default function AddEditEntryPage({ searchParams }) {
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const router = useRouter();
  const { itemId, type, category, cost, dateTime, description } = searchParams;
  // Without parsing, category.id or category.name cannot be called
  const parsedCategory = category ? JSON.parse(category) : null;

  const [categories, setCategories] = useState([]);
  // if you don't use formData and declare one useState for each field,
  // you would have to write handleChange function for each field,
  // that would not be flexible for adding/removing fields
  const [formData, setFormData] = useState({
    type: type || "OUTCOME",
    category: {
      id: parsedCategory?.id || 0,
      name: parsedCategory?.name || "",
    },
    cost: cost || 1,
    dateTime: dateTime || new Date().toISOString().slice(0, 16),
    description: description || "",
  });

  const setDefaultCategory = (data) => {
    // I had to use "data", because even calling this function after fetch's .then,
    // categories array is still not updated somehow
    setFormData((prevData) => ({
      ...prevData,
      category: {
        id: data[0].id,
        name: data[0].name,
      },
    }));
  };

  const fetchCategories = async () => {
    // same as these but .then can call functions after fetching
    // const response = await fetch(`${mainUrl}/category/all`);
    // const data = await response.json();
    fetch(`${mainUrl}/category/all`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        if (parsedCategory === null) {
          setDefaultCategory(data);
        }
      });
  };

  // For first render
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemId === undefined) {
      const response = await fetch(`${mainUrl}/entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      alert("New item successfully added!");
    } else {
      const response = await fetch(`${mainUrl}/entry/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      alert("An item successfully updated!");
    }

    router.push("/entry");
  };

  const handleChange = (e) => {
    const { name, id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "category"
          ? { id: value, name: e.target.selectedOptions[0].text }
          : value,
    }));
  };

  return (
    <Home>
      <div>
        <h1 className="text-3xl mb-5">Creating New Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center">
            <div className="text-xl mr-5">Finance Type: </div>
            <div>
              <label htmlFor="outcome" className="mr-2">
                Outcome
              </label>
              <input
                type="radio"
                id="outcome"
                name="type"
                value="OUTCOME"
                className="mr-7"
                onChange={handleChange}
                checked={formData.type === "OUTCOME"}
              />
              <label htmlFor="income" className="mr-2">
                Income
              </label>
              <input
                type="radio"
                id="income"
                name="type"
                value="INCOME"
                className="mr-7"
                onChange={handleChange}
                checked={formData.type === "INCOME"}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xl mr-5">Category: </div>
            <div>
              <select
                name="category"
                onChange={handleChange}
                value={formData.category.id}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xl mr-5">Cost Amount: </div>
            <div>
              <input
                type="number"
                id="cost"
                name="cost"
                min="0.01"
                max="1000000000"
                step="0.01"
                required
                onChange={handleChange}
                value={formData.cost}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xl mr-5">Date Time: </div>
            <div>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xl mr-5">Description: </div>
            <div>
              <textarea
                id="description"
                name="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </div>
          <button
            type="submit"
            className=" rounded-full p-2 bg-green-600 hover:bg-green-700"
          >
            Save
          </button>
        </form>
      </div>
    </Home>
  );
}
