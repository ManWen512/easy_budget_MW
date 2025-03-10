"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { currencySymbol } from "@/app/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchAccounts } from "@/redux/slices/balanceSlice";
import { submitEntry, clearStatus } from "@/redux/slices/entrySlice";

// only "searchParams" works, name cannot be changed
export default function AddEditEntryPage({ searchParams }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { accounts } = useSelector((state) => state.balance);
  const { loading, error, successMessage } = useSelector((state) => state.entry);

  
  const router = useRouter();
  const { itemId, type, category, balance, cost, dateTime, description } =
    searchParams;
  // Without parsing, category.id or category.name cannot be called
  const parsedCategory = category ? JSON.parse(category) : null;
  const parsedAccount = balance ? JSON.parse(balance) : null;
  const localDate = new Date();
  const localDateTime = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

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
    cost: cost || 1,
    dateTime: dateTime || localDateTime,
    description: description || "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories()).then((result) => {
      if (result.payload?.length > 0 && formData.category.id === 0) {
        setDefaultCategory(result.payload);
      }
    });
  
    dispatch(fetchAccounts()).then((result) => {
      if (result.payload?.length > 0 && formData.account.id === 0) {
        setDefaultAccount(result.payload);
      }
    });
  }, [dispatch]);

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

  



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitEntry({ itemId, formData }));
  };

  useEffect(() => {
    if (successMessage) {
      router.push(`/monthEntry?triggerSnackbar=${encodeURIComponent(successMessage)}`);
      dispatch(clearStatus()); // Reset state after redirection
    }
  }, [successMessage, router, dispatch]);


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
    <>
      <div>
        <h1 className="p-5 mt-14 text-3xl mb-2 flex font-bold justify-center content-center ">
          {itemId ? "Edit Entry" : "Create New Entry"}
        </h1>
        <div className="flex  justify-center ">
          <form onSubmit={handleSubmit} className="space-y-5 w-96 p-5">
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
              <div className="flex items-center overflow-hidden">
                <span className="bg-teal-100 py-3 pl-4 rounded-l-md">
                  {currencySymbol}
                </span>
                <input
                  className="w-full  p-3 rounded-r-md  bg-teal-100  focus:outline-none"
                  type="number"
                  id="cost"
                  name="cost"
                  min="0.01"
                  max="1000000000"
                  step="0.01"
                  onScroll={() => {}}
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
              {loading ? "Saving..." : "Save"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
