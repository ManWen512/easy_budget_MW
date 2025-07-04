"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  signupUser,
  fetchResetData,
  signinUser,
  fetchUser,
} from "@/redux/slices/authSlice";
import { showSnackbar, closeSnackbar } from "@/redux/slices/snackBarSlice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { status, error } = useSelector((state) => state.auth);
  const { open, message, severity } = useSelector((state) => state.snackbar);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    dispatch(signupUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchUser());

        router.push(`/dashboard?loginSnackbar=${encodeURIComponent(
          "Successfully logged in"
        )}`);
      }
    });
  };

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
    if (passwordError) {
      dispatch(showSnackbar({ message: passwordError, severity: "error" }));
    }
  }, [status, error, passwordError, dispatch]);

  const handleGuestLogin = () => {
    dispatch(
      signinUser({
        email: process.env.NEXT_PUBLIC_EMAIL,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchUser());
        dispatch(fetchResetData());
        router.push(`/dashboard?loginSnackbar=${encodeURIComponent(
          "Successfully logged in as a guest user"
        )}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Snackbar
        open={open}
        onClose={() => dispatch(closeSnackbar())}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(closeSnackbar())}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <div className="w-full max-w-sm   ">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="">Please sign up to your account</p>
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
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-teal-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-colors"
                  placeholder="Enter your username"
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-teal-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-teal-400 hover:text-teal-500" />
                  ) : (
                    <FaEye className="text-teal-400 hover:text-teal-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
            >
              Sign Up
            </button>

            <div className="text-center mt-4">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href="/login"
                className="text-teal-500 hover:underline font-semibold"
              >
                Login
              </Link>
            </div>
          </form>
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
