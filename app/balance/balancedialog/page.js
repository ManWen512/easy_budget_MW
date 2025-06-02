"use client";

import { useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addAccount, updateAccount } from "@/redux/slices/balanceSlice";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/AnimatedButton";

export default function BalanceDialogPage({ accId, name, balance, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [accData, setAccData] = useState({
    name: name || "",
  });

  const handleChange = (e) => {
    setAccData({
      ...accData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accId) {
      dispatch(updateAccount({ id: accId, ...accData }));
      onSuccess("Account updated successfully!");
    } else {
      dispatch(addAccount(accData));
      onSuccess("Account added successfully!");
    }
    onClose();
    if (returnTo) {
      router.push(returnTo);
    }
  };

  return (
    <AnimatePresence mode="wait" >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3
          }}
          className="bg-teal-100 p-6 rounded-lg shadow-lg sm:w-1/3"
        >
          <h2 className="text-xl font-semibold mb-4">
            {accId ? "Edit Account" : "Add New Account"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Account Name</label>
              <input
                type="text"
                name="name"
                value={accData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter account name"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <AnimatedButton
                type="button"
                onClick={onClose}
                variant="secondary"
              >
                Close
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                variant="primary"
              >
                Save
              </AnimatedButton>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
