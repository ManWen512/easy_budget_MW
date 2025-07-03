"use client";
import Link from "next/link";
import Image from "next/image";
import Pixel from "../public/Pixel.png";

export default function Home() {
  return (
    <div className="relative min-h-screen  bg-gradient-to-br from-teal-50 to-white flex flex-col">
      {/* Top Left: Logo and Text */}
      <div className="absolute top-0 left-0 flex items-center p-6">
        <Image src={Pixel} alt="logo" width={40} height={40} />
        <span className="ml-2 text-sm sm:text-2xl font-bold text-teal-700 tracking-wide">EASYBUDGET</span>
      </div>

      {/* Top Right: Login and Signup */}
      <div className="absolute top-0 right-0 flex space-x-2 p-6">
        <Link href="/login">
          <button className="px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 font-semibold transition">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-semibold transition">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Center Content */}
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-700 mb-6 text-center">
          Welcome to EasyBudget
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-xl px-4">
          Take control of your finances with EasyBudget. Track your expenses, manage your categories, and visualize your spending with ease.
        </p>
        <Link href="/login">
          <button className="px-8 py-4 bg-teal-500 text-white rounded-xl text-xl font-bold shadow-lg hover:bg-teal-600 transition">
            Get Started - Login
          </button>
        </Link>
      </div>
    </div>
  );
}