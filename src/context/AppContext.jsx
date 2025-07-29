// src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useUser } from "../hooks/useUser";
import { useTrades } from "../hooks/useTrades";
import { usePayments } from "../hooks/usePayments";
import { initTelegramWebApp } from "../utils/telegram";

const AppContext = createContext();

const initialState = {
  isLoading: true,
  error: null,
  notifications: [],
  theme: "light",
  language: "uz",
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 9)],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, apiCall } = useApi();
  const userHook = useUser();
  const tradesHook = useTrades();
  const paymentsHook = usePayments();

  useEffect(() => {
    // Telegram WebApp ni ishga tushirish
    const tg = initTelegramWebApp();

    if (tg) {
      // Tema o'zgarishini kuzatish
      tg.onEvent("themeChanged", () => {
        dispatch({
          type: "SET_THEME",
          payload: tg.colorScheme === "dark" ? "dark" : "light",
        });
      });

      // Viewport o'zgarishini kuzatish
      tg.onEvent("viewportChanged", () => {
        // Handle viewport changes if needed
      });
    }

    // Loading holatini yangilash
    if (
      isAuthenticated &&
      !userHook.loading &&
      !tradesHook.loading &&
      !paymentsHook.loading
    ) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    isAuthenticated,
    userHook.loading,
    tradesHook.loading,
    paymentsHook.loading,
  ]);

  // Notification qo'shish funksiyasi
  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };

    dispatch({ type: "ADD_NOTIFICATION", payload: notification });

    // Avtomatik o'chirish
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
      }, duration);
    }

    return id;
  };

  // Error handling
  const handleError = (error, showNotification = true) => {
    console.error("App Error:", error);
    dispatch({ type: "SET_ERROR", payload: error.message });

    if (showNotification) {
      addNotification(error.message, "error");
    }
  };

  // Success notification
  const showSuccess = (message) => {
    addNotification(message, "success");
  };

  // Loading state
  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const value = {
    // State
    ...state,
    isAuthenticated,

    // Hooks
    user: userHook,
    trades: tradesHook,
    payments: paymentsHook,

    // Actions
    dispatch,
    addNotification,
    handleError,
    showSuccess,
    setLoading,
    apiCall,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
