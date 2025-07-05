"use client";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const PUBLIC_PATHS = ["/", "/signup", "/login"];

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Optionally, you can show nothing or a loading spinner while redirecting
  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
    return <div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>;
  }

  return children;
}