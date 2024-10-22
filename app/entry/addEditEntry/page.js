"use client";

import { useRouter } from "next/navigation";
import Home from "../../page";
import { useEffect, useState } from "react";
import { currencySymbol } from "@/app/currency";

// only "searchParams" works, name cannot be changed
export default function AddEditEntryPage({ searchParams, triggerSnackbar }) {
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const router = useRouter();
  const { itemId, type, category, account, cost, dateTime, description } =
    searchParams;
  // Without parsing, category.id or category.name cannot be called
  const parsedCategory = category ? JSON.parse(category) : null;
  const parsedAccount = account ? JSON.parse(account) : null;
  const localDate = new Date();
    const localDateTime = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts ] = useState([]);
  // if you don't use formData and declare one useState for each field,
  // you would have to write handleChange function for each field,
  // that would not be flexible for adding/removing fields
  const [formData, setFormData] = useState({
    type: type || "OUTCOME",
    category: {
      id: parsedCategory?.id || 0,
      name: parsedCategory?.name || "",
    },
    account: {
      id: parsedAccount?.id || 0,
      name: parsedAccount?.name || "",
    },
    cost: cost || 1 ,
    dateTime: dateTime || localDateTime,
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

  const setDefaultAccount = (data) => {
    // I had to use "data", because even calling this function after fetch's .then,
    // categories array is still not updated somehow
    setFormData((prevData) => ({
      ...prevData,
      account: {
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

  const fetchAccounts = async () => {
    // same as these but .then can call functions after fetching
    // const response = await fetch(`${mainUrl}/category/all`);
    // const data = await response.json();
    fetch(`${mainUrl}/account/all`)
      .then((response) => response.json())
      .then((data) => {
        setAccounts(data);
        if (parsedAccount === null) {
          setDefaultAccount(data);
        }
      });
  };

  // For first render
  useEffect(() => {
    fetchCategories();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(itemId);
    try {
      if (itemId === undefined) {
        const response = await fetch(`${mainUrl}/entry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        router.push(`/monthEntry?triggerSnackbar=${encodeURIComponent('Entry Added successfully!')}`);
      } else {
        const response = await fetch(`${mainUrl}/entry?id=${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
       
        router.push(`/monthEntry?triggerSnackbar=${encodeURIComponent('Entry Updated successfully!')}`);
      }
    } catch {
      console.log(error);
    }

   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        category: {
          id: selectedCategory?.id || 0,
          name: selectedCategory?.name || "",
        },
      }));
    } else if (name === "account") {
      const selectedAccount = accounts.find(
        (acc) => acc.id === parseInt(value)
      );
      setFormData((prevData) => ({
        ...prevData,
        account: {
          id: selectedAccount?.id || 0,
          name: selectedAccount?.name || "",
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Home>
      <div>
        <h1 className="text-3xl mb-5 flex font-bold justify-center content-center ">
          Creating New Entry
        </h1>
        <div className="flex  justify-center">
          <form onSubmit={handleSubmit} className="space-y-5 w-96">
            <div className=" items-center">
              <div className=" mr-5 mb-2 font-bold ">Finance Type: </div>
              <div className="flex">
                <label
                  className={`w-full relative font-bold  cursor-pointer p-3 border rounded-lg transition-all ${
                    formData.type === "OUTCOME"
                      ? "border-l-4 border-teal-500 bg-teal-100"
                      : "border-teal-500"
                  }`}
                >
                  Outcome
                  <input
                    type="radio"
                    id="outcome"
                    name="type"
                    value="OUTCOME"
                    className="sr-only peer"
                    onChange={handleChange}
                    checked={formData.type === "OUTCOME"}
                  />
                </label>
                <label
                  className={`ml-3 w-full font-bold  relative cursor-pointer p-3 border rounded-lg transition-all ${
                    formData.type === "INCOME"
                      ? "border-l-4 border-teal-500 bg-teal-100"
                      : "border-teal-500"
                  }`}
                >
                  Income
                  <input
                    type="radio"
                    id="income"
                    name="type"
                    value="INCOME"
                    className="sr-only peer"
                    onChange={handleChange}
                    checked={formData.type === "INCOME"}
                  />
                </label>
              </div>
            </div>
            <div className=" items-center">
              <div className=" mr-5 mb-2 font-bold ">Category: </div>
              <div>
                <select
                  className="w-full p-3  rounded-md  bg-teal-100"
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
            <div className=" items-center">
              <div className="mr-5 mb-2 font-bold ">Account: </div>
              <div>
                <select
                  className="w-full p-3 border rounded-md  bg-teal-100"
                  name="account"
                  onChange={handleChange}
                  value={formData.account.id}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className=" items-center">
              <div className=" mr-5 mb-2 font-bold ">Cost Amount: </div>
              <div className='flex items-center overflow-hidden'>
                <span className='bg-teal-100 py-3 pl-4 rounded-l-md'>{currencySymbol}</span>
                <input
                  className="w-full  p-3 rounded-r-md  bg-teal-100  focus:outline-none"
                  type="number"
                  id="cost"
                  name="cost"
                  min="0.01"
                  max="1000000000"
                  step="0.01"
                  onScroll={()=> {}}
                  required
                  onChange={handleChange}
                  value={formData.cost}
                />
              </div>
            </div>
            <div className=" items-center">
              <div className=" mr-5 mb-2 font-bold ">Date Time: </div>
              <div>
                <input
                  className="w-full p-3 border rounded-md  bg-teal-100 focus:outline-none"
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className=" items-center">
              <div className=" mr-5 mb-2 font-bold ">Description: </div>
              <div>
                <textarea
                  className="w-full p-2 border rounded-md  bg-teal-100 focus:outline-none"
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
              className="font-bold  rounded px-4 py-2 bg-orange-400  hover:bg-orange-400"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </Home>
  );
}
