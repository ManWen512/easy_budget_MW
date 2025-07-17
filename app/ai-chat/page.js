"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import {
  selectError,
  selectHistory,
  selectNewChat,
  selectStatus,
} from "@/redux/selectors/aiChatSelectors";
import { selectTheme } from "@/redux/selectors/settingsSelectors";
import { addChat, fetchChatHistory } from "@/redux/slices/aiChatSlice";
import { showSnackbar } from "@/redux/slices/snackBarSlice";
import { createTheme, TextField, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { fetchUser } from "@/redux/slices/authSlice";

const darkMuiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#1f2937",
      default: "#111827",
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

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  MAX_CHATS: 5,
  CONTINUOUS_LIMIT: 3,
  COOLDOWN_PERIOD: 2000, // 1 minute in ms
};

export default function AIAssistant() {
  const dispatch = useDispatch();
  const history = useSelector(selectHistory);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const theme = useSelector(selectTheme);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quickSend, setQuickSend] = useState(null);
  const [chatAttempts, setChatAttempts] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [dailyLimited, setDailyLimited] = useState(false);
  const chatEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchChatHistory());
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(showSnackbar({ message: error, severity: "error" }));
    }
  }, [status, error, dispatch]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  useEffect(() => {
    checkRateLimit();
  }, [history.dailyRateLimit]);

  // Check rate limiting
  const checkRateLimit = () => {
    const now = Date.now();
    const recentChats = chatAttempts.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_CONFIG.COOLDOWN_PERIOD
    );

    // Check continuous chat limit (3 in 1 minute)
    if (recentChats.length >= RATE_LIMIT_CONFIG.CONTINUOUS_LIMIT) {
      setIsRateLimited(true);
      setTimeout(() => {
        setIsRateLimited(false);
        setChatAttempts([]);
      }, RATE_LIMIT_CONFIG.COOLDOWN_PERIOD);
      return true;
    }

    // Check total chat limit (5)
    if (history.dailyRateLimit >= RATE_LIMIT_CONFIG.MAX_CHATS) {
      dispatch(
        showSnackbar({
          message: "Daily chat limit reached (5 chats)",
          severity: "error",
        })
      );
      setDailyLimited(true);
      return true;
    }

    return false;
  };

  // Send chat handler
  const handleSend = async (overrideText) => {
    const sendText = overrideText !== undefined ? overrideText : input;

    if (!sendText.trim()) {
      dispatch(
        showSnackbar({
          message: "Please enter a message",
          severity: "error",
        })
      );
      return;
    }

    if (isRateLimited) {
      dispatch(
        showSnackbar({
          message: "Please wait 1 minute before sending another message",
          severity: "error",
        })
      );
      return;
    }

    setSending(true);
    setChatAttempts((prev) => [...prev, Date.now()]);

    try {
      await dispatch(addChat({ message: sendText }));
      setInput("");
      dispatch(fetchChatHistory());
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setSending(false);
    }
  };

  // Effect to send quick question if set
  useEffect(() => {
    if (quickSend) {
      handleSend(quickSend);
      setQuickSend(null);
    }
  }, [quickSend]);

  // Enter key handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col p-5 mt-14 container content-center sm:mt-0 min-h-screen">
      <>
        <div className="">
          <div className="flex items-center justify-left mb-5">
            <div className="text-3xl font-bold dark:text-white">AI Chat</div>
            <div className="text-lg text-gray-600 dark:text-gray-300 ml-10">
              Daily Limit - {history.dailyRateLimit}/
              {RATE_LIMIT_CONFIG.MAX_CHATS} chats
            </div>
          </div>
          {status === "loading" ? (
            <LoadingSpinner />
          ) : (
            <div className="flex-1 overflow-y-auto sm:p-4 space-y-6 mb-20 ">
              {history?.chatHistory?.length > 0 ? (
                history.chatHistory.map((his, idx) => (
                  <div key={idx}>
                    {his.prompt && (
                      <div className="flex justify-end">
                        <div className="max-w-xs px-4 py-2 mb-2 rounded-lg shadow text-sm bg-teal-200 ">
                          {his.prompt}
                        </div>
                      </div>
                    )}
                    {his.response && (
                      <div className="flex justify-start">
                        <div className="max-w-xs px-4 py-2 rounded-lg shadow text-sm bg-gray-200 dark:bg-gray-700 dark:text-white">
                          <ReactMarkdown>{his.response}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col gap-4 mt-10">
                  <div className="text-xl dark:text-white">
                    Example Questions
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg shadow bg-teal-100 hover:bg-teal-200 text-gray-800 text-sm"
                    onClick={() => setQuickSend("What did I spend the most?")}
                    disabled={isRateLimited}
                  >
                    What did I spend the most?
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg shadow bg-teal-100 hover:bg-teal-200 text-gray-800 text-sm"
                    onClick={() => setQuickSend("What did I spend the least?")}
                    disabled={isRateLimited}
                  >
                    What did I spend the least?
                  </button>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
        {/* Chat Input - sticky at bottom of viewport */}
        <div className="fixed bottom-0 left-0 z-0 w-screen h-[88px] bg-gradient-to-br from-teal-50 to-white dark:bg-gradient-to-br dark:from-teal-900 dark:to-black"></div>
        <div className="fixed bottom-0 ml-0 rounded-xl left-0 md:left-auto w-full flex items-center gap-2 p-4 z-20 ">
          {dailyLimited ? (
            <div>
              <div className="fixed bottom-8 left-1/4 sm:left-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow">
                Daily Limit Excceeded!
              </div>
            </div>
          ) : (
            <div className="max-w-3xl w-full flex items-center gap-2">
              <ThemeProvider
                theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
              >
                <TextField
                  id="outlined-multiline-flexible"
                  inputProps={{ maxLength: 100 }}
                  label={
                    isRateLimited
                      ? "Please wait 1 minute..."
                      : "Type Your Message..."
                  }
                  value={input}
                  name="text"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending || isRateLimited}
                  required
                />
              </ThemeProvider>
              <button
                className="bg-teal-200 px-4 py-2 rounded-lg shadow disabled:opacity-50"
                onClick={() => handleSend()}
                disabled={sending || !input.trim() || isRateLimited}
              >
                Send
              </button>
            </div>
          )}
        </div>
        {isRateLimited && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow">
            Too Many Requests. Please wait 20 Seconds before sending another
            message.
          </div>
        )}
      </>
    </div>
  );
}
