"use client";

import PieChart from "@/components/pieChart";
import Home from "../page";
import BarChart from "@/components/barChart";
import { useState } from "react";

export default function graphsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Home>
      <div>Hi from graphs</div>
      <div className="grid grid-cols-3 gap-3">

        {/* //1st dropdown */}
        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="inline-flex items-center">
            Month<svg
              class="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute">
            <ul >
              <li>January</li>
            </ul>
          </div>
          )}
        </div>
       
        
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-20">
          <BarChart />
        </div>
        <div >
          <PieChart />
        </div>
      </div>
    </Home>
  );
}
