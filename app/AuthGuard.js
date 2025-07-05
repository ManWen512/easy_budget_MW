"use client";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { logout } from "@/redux/slices/authSlice";

const PUBLIC_PATHS = ["/", "/signup", "/login"];

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on every route change
    const token = localStorage.getItem("token");
    if (!token && isAuthenticated) {
      // Token is missing but Redux state shows authenticated, so logout
      dispatch(logout());
    }
    setIsChecking(false);
  }, [pathname, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return <div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>;
  }

  // Optionally, you can show nothing or a loading spinner while redirecting
  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
    return <div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>;
  }

  return children;
}