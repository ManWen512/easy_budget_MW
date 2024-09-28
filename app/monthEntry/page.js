"use client";

import BarChart from "@/components/barChart";
import Home from "../page";

export default function monthEntryPage() {
  return (
    <Home>
      <div className="static">
        <div className="flex justify-center content-center">
          <div className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="mb-5 rounded-2xl text-center block w-1/4 p-3 bg-black border border-gray-200 rounded-lg">
            <div className="text-1xl  text-white">January 2024</div>
          </div>
          <div className="ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="3"
              stroke="currentColor"
              class="size-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
        <div className="mb-2 rounded-3xl text-center block w-1/4 p-3 bg-black border border-gray-200 rounded-lg">
          <div className="text-1xl  text-white">1st week</div>
        </div>

        {/* 1st one */}
        <div className="grid grid-cols-4 gap-5 flex justify-between mb-2">
          <div className="rounded-3xl  text-center block  p-3 bg-black border border-gray-200 rounded-lg">
            <div className="text-1xl  text-white">1.1.2024</div>
          </div>
          <div>
            <div className="rounded-2xl  text-center block p-3  bg-yellow-600 border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">Food meat 1kg Food</div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl  text-center block p-3 w-1/2 bg-black border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">5$</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div>
              <button className="mr-5 bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-2xl ">
                Edit
              </button>
            </div>
            <div>
              <button className="bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-2xl ">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* 2nd one */}
        <div className="grid grid-cols-4 gap-5 flex justify-between mb-2">
          <div className="rounded-3xl  text-center block  p-3 bg-black border border-gray-200 rounded-lg">
            <div className="text-1xl  text-white">1.1.2024</div>
          </div>
          <div>
            <div className="rounded-2xl text-center block p-3 px-10 bg-yellow-600 border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">Toy meat 1kg</div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl  text-center block p-3 w-1/2 bg-black border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">5$</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div>
              <button className="mr-5 bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-2xl ">
                Edit
              </button>
            </div>
            <div>
              <button className="bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-2xl ">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* total */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex justify-end">
            <div className="rounded-2xl text-center block p-3 px-10 bg-black border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">Total</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="rounded-2xl text-center block p-3 w-1/4 bg-black border border-gray-200 rounded-lg">
              <div className="text-1xl  text-white">10$</div>
            </div>
          </div>
        </div>


        <div className="absolute bottom-10 right-10">
          <button className="bg-yellow-950 hover:bg-yellow-800 text-white font-bold py-4 px-6 rounded-2xl ">
            Add New
          </button>
        </div>
      </div>
    </Home>
  );
}
