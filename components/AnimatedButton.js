import { motion } from "framer-motion";

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary", // primary, secondary, or danger
}) {
  const baseClasses = "px-4 py-2 rounded-md transition-colors";
  const variantClasses = {
    primary: "bg-teal-400 hover:bg-teal-500 text-white",
    secondary: "border-2 border-teal-400 hover:bg-teal-50 text-teal-600",
    danger: "bg-red-400 hover:bg-red-500 text-white",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      {children}
    </motion.button>
  );
} 