"use client";

import BarChart from "@/components/barChart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ children }) {
  const [totalBalance, setTotalBalance] = useState(0);
  const mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
  const pathname = usePathname();

  useEffect(() => {
    fetchTotalBalance();
  }, []);

  const fetchTotalBalance = async () => {
    const response = await fetch(`${mainUrl}/account/totalBalance`);
    const data = await response.json();
    setTotalBalance(data);
  };

  return (
    <div className="flex min-h-screen">
      <div className=" flex flex-col bg-amber-900 border-r-2 border-black w-1/4 min-h-screen">
        <div className="flex items-center p-3">
          <div className="bg-black w-14 h-14 rounded-full mr-5"></div>
          <div className="text-3xl text-white font-bold">Easy Budget</div>
        </div>
        <div className="flex flex-col items-center space-y-5 text-xl p-5">
          <div>
            <Link
              href={"/"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                (pathname === "/" ? "bg-amber-600 font-bold" : "")
              }
            >
              Dashboard
            </Link>
          </div>
          <div>
            <Link
              href={{
                pathname: "/balance",
              }}
              // query: {
              //   totalBalance: totalBalance,
              // }
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                (pathname === "/balance" ? "bg-amber-600 font-bold" : "")
              }
            >
              Balance
            </Link>
          </div>
          <div>
            <Link
              href={"/category"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                (pathname === "/category" ? "bg-amber-600 font-bold" : "")
              }
            >
              Categories
            </Link>
          </div>
          <div>
            <Link
              href={"/graphs"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                (pathname === "/graphs" ? "bg-amber-600 font-bold" : "")
              }
            >
              Graphs
            </Link>
          </div>
          <div>
            <Link
              href={"/monthEntry"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-5 py-2  text-white hover:text-black " +
                (pathname === "/monthEntry" ? "bg-amber-600 font-bold" : "")
              }
            >
              Month Entry
            </Link>
          </div>
          <div>
            <Link
              href={"/history"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2  text-white hover:text-black " +
                (pathname === "/history" ? "bg-amber-600 font-bold" : "")
              }
            >
              History
            </Link>
          </div>
          <div>
            <Link
              href={"/setting"}
              // This is so cool react+tailwind combo
              className={
                "hover:bg-amber-400 rounded-xl px-7 py-2 text-white hover:text-black " +
                (pathname === "/setting" ? "bg-amber-600 font-bold" : "")
              }
            >
              Setting
            </Link>
          </div>
        </div>
      </div>
      <div className=" p-5 bg-yellow-300 	h-auto w-screen ">
        {children ? (
          children
        ) : (
          <div className="container content-center">
            <div className="grid grid-cols-2 gap-4 ">
              <div className="h-48 rounded-2xl text-center content-center block max-w p-6 bg-yellow-950 border border-gray-200 rounded-lg shadow hover:bg-yellow-900 dark:bg-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-800">
                <div className="mb-2 text-2xl font-bold text-white">
                  Total Balance
                </div>
                <br></br>
                <div className="mb-2 text-3xl font-bold text-white">
                  $ {totalBalance}
                </div>
              </div>
            </div>

            <div>
              <div className="m-2 font-bold">Overview </div>
              <div className="bd-white">
                <BarChart />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
