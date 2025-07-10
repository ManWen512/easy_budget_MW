"use client";
import { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { persistor } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { setCurrency, setTheme } from "@/redux/slices/settingSlice";
import {
  selectCurrency,
  selectTheme,
} from "@/redux/selectors/settingsSelectors";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkMuiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1f2937", // Tailwind gray-800
      default: "#111827", // Tailwind gray-900
    },
    text: {
      primary: "#fff",
    },
  },
});

const lightMuiTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function SettingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currency = useSelector(selectCurrency);
  const theme = useSelector(selectTheme);
  const { user, status, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [localCurrency, setLocalCurrency] = useState(null);
  const [localTheme, setLocalTheme] = useState(null);

  useEffect(() => {
    setLocalCurrency(currency);
    setLocalTheme(theme);
  }, [currency, theme]);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();

    router.push("/login");
    dispatch(
      showSnackbar({ message: "Successfully logged out", severity: "success" })
    );
  };

  const handleSaveChanges = () => {
    if (localCurrency) {
      dispatch(setCurrency(localCurrency));
      router.push("/dashboard");
      dispatch(
        showSnackbar({
          message: "Successfully changed Currency",
          severity: "success",
        })
      );
    }
    if (localTheme) {
      dispatch(setTheme(localTheme));
      router.push("/dashboard");
      dispatch(
        showSnackbar({
          message: "Successfully changed Appearance",
          severity: "success",
        })
      );
    }
  };

  return (
    <div className="w-full sm:w-1/2 mt-20 sm:mt-10 p-6 rounded-xl shadow-md bg-gradient-to-br from-teal-50 to-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black dark:text-white">
      <div className="text-3xl font-bold mb-10 dark:text-white">Settings</div>
      <div className="flex flex-col items-center">
        <img
          src={
            user?.avatar ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user?.username || "U")
          }
          alt="profile"
          className="w-16 h-16 rounded-full object-cover border border-gray-300 mb-3"
        />
        <div className="text-lg font-bold">{user?.username}</div>
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-3">
          {user?.email}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Currency Setting */}
        <FormControl fullWidth>
          <InputLabel className="dark:text-white">Currency</InputLabel>
          <ThemeProvider
            theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
          >
            <Select
              value={localCurrency ?? ""}
              label="Currency"
              onChange={(e) => setLocalCurrency(e.target.value)}
              className={theme === "dark" ? "dark:bg-gray-700" : ""}
            >
              <MenuItem value="$">USD ($)</MenuItem>
              <MenuItem value="MMK">MMK (Ks)</MenuItem>
              <MenuItem value="€">EUR (€)</MenuItem>
              <MenuItem value="£">GBP (£)</MenuItem>
            </Select>
          </ThemeProvider>
        </FormControl>

        {/* Appearance Setting */}
        <FormControl fullWidth>
          <InputLabel className="dark:text-white ">Appearance</InputLabel>
          <ThemeProvider
            theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
          >
            <Select
              value={localTheme ?? ""}
              label="Appearance"
              onChange={(e) => setLocalTheme(e.target.value)}
              className={theme === "dark" ? "dark:bg-gray-700" : ""}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              
            </Select>
          </ThemeProvider>
        </FormControl>
        <div >
          <button
            onClick={handleSaveChanges}
            className="mt-5 mb-5 w-full px-4 py-2 dark:text-gray-500 bg-teal-200  rounded-lg hover:bg-teal-300 font-semibold transition"
          >
            Save Changes
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
