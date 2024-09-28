"use client";
import { useRouter } from "next/navigation";
import Home from "../../page";
import { useEffect, useState } from "react";

export default function AddBalance({ searchParams }) {
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const router = useRouter();
  const { accId, name, balance } = searchParams;

  const [balances, setBalances] = useState({
    name: name || "",
    balance: balance || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (accId === undefined) {
      const response = await fetch(`${mainUrl}/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(balances),
      });
      alert("New card successfully added!");
    } else {
      const response = await fetch(`${mainUrl}/entry/${accId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(balances),
      });
      alert("An card successfully updated!");
    }

    router.push("/balance");
  };

  const handleChange = (e) => {
    const {name, id} = e.target;
    setBalances([name]);
  }

  return (
    <Home>
        <h2 className=" m-8 font-bold text-2xl">ADD CARD</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center grid grid-cols-2 gap-5 mb-3">
          <div className="flex text-xl mr-5 justify-end">
            Name of your Card:{" "}
          </div>
          <div>
            <input
              className="justify-start shadow appearance-none border rounded-2xl w-1/2 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              onChange={handleChange}
              required
              value={balances.name}
            />
          </div>
        </div>
        <div className="flex items-center grid grid-cols-2 gap-5 mb-3">
          <div className="flex text-xl mr-5 justify-end">Balance: </div>
          <div className="flex justify-start">
            <input
              className=" shadow appearance-none border rounded-2xl w-1/2 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="balance"
              name="balance"
              required
              onChange={handleChange}
              value={balances.balance}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className=" bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-4 px-6 rounded-2xl "
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </Home>
  );
}
