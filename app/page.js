"use client";
import Link from "next/link";
import Image from "next/image";
import Pixel from "../public/Pixel.png";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleLogin = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="relative min-h-screen  flex flex-col">
      {/* Top Left: Logo and Text */}
      <div className="absolute top-0 left-0 flex items-center p-6">
        <Image src={Pixel} alt="logo" width={40} height={40} />
        <span className="ml-2 text-sm sm:text-2xl font-bold text-teal-700 dark:text-teal-100
         tracking-wide">
          EASYBUDGET
        </span>
      </div>

      {/* Top Right: Login and Signup */}
      <div className="absolute top-0 right-0 flex space-x-2 p-6">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-white border border-teal-500 text-teal-600  rounded-lg hover:bg-teal-50 font-semibold transition"
        >
          Login
        </button>
        <button
          onClick={handleSignUp}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-semibold transition"
        >
          Sign Up
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-1 flex-col justify-center items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-teal-700 dark:text-teal-100 mb-6 text-center">
          Welcome to EasyBudget
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 mb-10 text-center max-w-xl px-4">
          Take control of your finances with EasyBudget. Track your expenses,
          manage your categories, and visualize your spending with ease.
        </p>
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-teal-500 text-white rounded-xl text-xl font-bold shadow-lg hover:bg-teal-600 transition"
        >
          Get Started - Login
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        © 2025 Easy Budget — Manage your finances with ease. All rights reserved.
      </div>
    </div>
  );
}
