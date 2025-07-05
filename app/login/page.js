"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  signinUser,
  fetchResetData,
  fetchUser,
} from "@/redux/slices/authSlice";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { error, status } = useSelector((state) => state.auth);
  // const { open, message, severity } = useSelector((state) => state.snackbar);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const message = searchParams.get("logoutSnackbar");
    if (message) {
      dispatch(showSnackbar({ message, severity: "success" }));
    }
  }, [searchParams]);

  useEffect(()=>{
    if(status == 'failed'){
      dispatch(showSnackbar({ message: error, severity:"error"}))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signinUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchUser());

        router.push("/dashboard");
        dispatch(
          showSnackbar({
            message: "Successfully logged in",
            severity: "success",
          })
        );
      }
    });
  };

  

  const handleGuestLogin = async () => {
    setLoading(true);
    const res = await dispatch(
      signinUser({
        email: process.env.NEXT_PUBLIC_EMAIL,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      await dispatch(fetchUser());
      await dispatch(fetchResetData());

      router.push("/dashboard");
      dispatch(
        showSnackbar({
          message: "Successfully logged in as a guest user",
          severity: "success",
        })
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-sm ">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="">Please sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-teal-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-teal-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-teal-400 hover:text-teal-500" />
                  ) : (
                    <FaEye className="text-teal-400 hover:text-teal-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-400 focus:ring-teal-400 cursor-pointer accent-teal-400"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-teal-400 hover:text-teal-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-teal-400 hover:text-teal-500"
              >
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              className="font-bold text-teal-400 hover:text-teal-500"
              onClick={handleGuestLogin}
            >
              Login as a Guest User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
