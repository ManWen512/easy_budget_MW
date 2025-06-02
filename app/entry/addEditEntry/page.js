"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { currencySymbol } from "@/app/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { fetchAccounts } from "@/redux/slices/balanceSlice";
import { submitEntry, clearStatus } from "@/redux/slices/entrySlice";
import { motion } from "framer-motion";

// only "searchParams" works, name cannot be changed
export default function AddEditEntryPage({ searchParams }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { accounts } = useSelector((state) => state.balance);
  const { loading, error, successMessage } = useSelector(
    (state) => state.entry
  );

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

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
      router.push(
        `/monthEntry?triggerSnackbar=${encodeURIComponent(successMessage)}`
      );
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
    <motion.div
      className="p-5 mt-14"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl mb-2 flex font-bold justify-center content-center"
        variants={itemVariants}
      >
        {itemId ? "Edit Entry" : "Create New Entry"}
      </motion.h1>
      <motion.div className="flex justify-center" variants={itemVariants}>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 w-96 p-5"
          variants={itemVariants}
        >
          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Finance Type: </div>
            <div className="flex">
              <motion.label
                className={`w-full relative font-bold cursor-pointer p-3 border rounded-lg transition-all ${
                  formData.type === "OUTCOME"
                    ? "border-l-4 border-teal-500 bg-teal-100"
                    : "border-teal-500"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.label>
              <motion.label
                className={`ml-3 w-full font-bold relative cursor-pointer p-3 border rounded-lg transition-all ${
                  formData.type === "INCOME"
                    ? "border-l-4 border-teal-500 bg-teal-100"
                    : "border-teal-500"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.label>
            </div>
          </motion.div>

          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Category: </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.select
                className="w-full p-3 rounded-md bg-teal-100 col-span-2"
                name="category"
                onChange={handleChange}
                value={formData.category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </motion.select>

              <motion.button
                type="button"
                onClick={() => {
                  router.push(
                    `/category?showAddNew=true&returnTo=${encodeURIComponent(
                      "/entry/addEditEntry"
                    )}`
                  );
                }}
                className="w-full p-3 rounded-md bg-orange-400 font-bold text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add New
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Account: </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.select
                className="w-full p-3 border rounded-md bg-teal-100 col-span-2"
                name="account"
                onChange={handleChange}
                value={formData.account.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </motion.select>
              <motion.button
                type="button"
                onClick={() => {
                  router.push(
                    `/balance?showAddNew=true&returnTo=${encodeURIComponent(
                      "/entry/addEditEntry"
                    )}`
                  );
                }}
                className="w-full p-3 rounded-md bg-orange-400 font-bold text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add New
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Cost: </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                {currencySymbol}
              </span>
              <motion.input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full p-3 pl-8 rounded-md bg-teal-100 relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                min="1"
                required
              />
            </div>
          </motion.div>

          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Date Time: </div>
            <div>
              <motion.input
                className="w-full p-3 border rounded-md bg-teal-100 focus:outline-none"
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                required
                onChange={handleChange}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              />
            </div>
          </motion.div>

          <motion.div className="items-center" variants={itemVariants}>
            <div className="mr-5 mb-2 font-bold">Description: </div>
            <div>
              <motion.textarea
                className="w-full p-2 border rounded-md bg-teal-100 focus:outline-none"
                id="description"
                name="description"
                required
                onChange={handleChange}
                value={formData.description}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="font-bold rounded px-4 py-2 bg-orange-400 hover:bg-orange-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Saving..." : "Save"}
          </motion.button>
          {error && <p className="text-red-500">{error}</p>}
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
