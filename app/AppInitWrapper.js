"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeTheme } from "@/redux/slices/settingSlice";

export default function AppInitWrapper({ children }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.setting.theme);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch, theme]);

  return children;
}
