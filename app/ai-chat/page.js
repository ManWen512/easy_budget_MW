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

export default function AIAssistant() {
  const dispatch = useDispatch();
  const history = useSelector(selectHistory);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const theme = useSelector(selectTheme);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quickSend, setQuickSend] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatHistory());
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

  // Send chat handler
  const handleSend = async (overrideText) => {
    const sendText = overrideText !== undefined ? overrideText : input;
    // if (typeof sendText !== 'string' ) {
    //     dispatch(showSnackbar({ message: "Too Many Request, Please Wait 1 min!", severity: "error" }));
    //     return
    // };
    // if ( !sendText.trim()){
    //     dispatch(showSnackbar({ message: "Too Many Request, Please Wait 1 min!", severity: "error" }));
    //     return
    // }
    setSending(true);
    await dispatch(addChat({ message: sendText }));
    setInput("");
    setSending(false);
    dispatch(fetchChatHistory());
    // Scroll to bottom after sending

  };

  // Effect to send quick question if set
  useEffect(() => {
    if (quickSend) {
      handleSend(quickSend);
      setQuickSend(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="text-3xl font-bold mb-5 dark:text-white">AI Chat</div>
          {status === "loading" ? (
            <LoadingSpinner />
          ) : (
            <div className="flex-1 overflow-y-auto sm:p-4 space-y-6 mb-20 ">
              {history.length > 0 ? (
                history.map((his, idx) => (
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
                          {his.response}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col  gap-4 mt-10">
                  <div className="text-xl   dark:text-white">
                    Example Questions
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg shadow bg-teal-100 hover:bg-teal-200 text-gray-800 text-sm"
                    onClick={() => setQuickSend("What did I spend the most?")}
                  >
                    What did I spend the most?
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg shadow bg-teal-100 hover:bg-teal-200 text-gray-800 text-sm"
                    onClick={() => setQuickSend("What did I spend the least?")}
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
        <div className="fixed bottom-0 ml-0 rounded-xl left-0 md:left-auto w-full  flex items-center gap-2 p-4 z-20 ">
          <div className="max-w-3xl w-full  flex items-center  gap-2">
            <ThemeProvider
              theme={theme === "dark" ? darkMuiTheme : lightMuiTheme}
            >
              <TextField
                id="outlined-multiline-flexible"
                inputProps={{ maxLength: 100 }} // limits to 100 characters
                label="Type Your Message..."
                value={input}
                name="text"
                className="w-full p-2 border rounded-md"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
                required
              />
            </ThemeProvider>
            <button
              className="bg-teal-200  px-4 py-2 rounded-lg shadow"
              onClick={() => handleSend()}
              disabled={sending || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </>
    </div>
  );
}
