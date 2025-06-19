"use client";
import React from "react";

const AnimatedButton = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary", // primary, secondary, danger
  size = "md", // sm, md, lg
  fullWidth = false,
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500 active:bg-teal-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
        transform hover:scale-105 active:scale-95
        shadow-md hover:shadow-lg
        transition-all duration-200 ease-in-out
      `}
    >
      {children}
    </button>
  );
};

export default AnimatedButton; 