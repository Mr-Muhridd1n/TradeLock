// src/context/AppContext.jsx - Yangilangan versiya
import { createContext, useContext, useReducer, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useUser } from "../hooks/useUser";
import { useTrades } from "../hooks/useTrades";
import { usePayments } from "../hooks/usePayments";
import { initTelegramWebApp } from "../utils/telegram";
import { OfflineStorage } from "../utils/offlineStorage";

const AppContext = createContext();

const initialState = {
  isLoading: true,
  error: null,
  notifications: [],
  theme: "light",
  language: "uz",
  isOfflineMode: false,
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
    case "SET_OFFLINE_MODE":
      return { ...state, isOfflineMode: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, apiCall, isOfflineMode } = useApi();
  const userHook = useUser();
  const tradesHook = useTrades();
  const paymentsHook = usePayments();

  useEffect(() => {
    // Telegram WebApp ni ishga tushirish
    const tg = initTelegramWebApp();

    // Offline mode ni set qilish
    dispatch({ type: "SET_OFFLINE_MODE", payload: isOfflineMode });

    if (tg) {
      // Tema o'zgarishini kuzatish
      try {
        tg.onEvent("themeChanged", () => {
          dispatch({
            type: "SET_THEME",
            payload: tg.colorScheme === "dark" ? "dark" : "light",
          });
        });

        // Viewport o'zgarishini kuzatish
        tg.onEvent("viewportChanged", () => {
          // Handle viewport changes if needed
          console.log("Viewport changed:", tg.viewportHeight);
        });
      } catch (error) {
        console.warn("Failed to set up Telegram event listeners:", error);
      }
    } else {
      // Fallback uchun tema sistemani system preference dan olish
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch({ type: "SET_THEME", payload: prefersDark ? "dark" : "light" });

      // System theme changes ni kuzatish
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleThemeChange = (e) => {
        dispatch({ type: "SET_THEME", payload: e.matches ? "dark" : "light" });
      };

      mediaQuery.addEventListener("change", handleThemeChange);

      // Cleanup function
      return () => {
        mediaQuery.removeEventListener("change", handleThemeChange);
      };
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
    isOfflineMode,
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
    const errorMessage = error.message || "Noma'lum xatolik yuz berdi";

    dispatch({ type: "SET_ERROR", payload: errorMessage });

    if (showNotification) {
      addNotification(errorMessage, "error");
    }
  };

  // Success notification
  const showSuccess = (message) => {
    addNotification(message, "success");
  };

  // Warning notification
  const showWarning = (message) => {
    addNotification(message, "warning");
  };

  // Info notification
  const showInfo = (message) => {
    addNotification(message, "info");
  };

  // Loading state
  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  // Clear all notifications
  const clearNotifications = () => {
    state.notifications.forEach((notification) => {
      dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id });
    });
  };

  // Offline mode toggle
  const toggleOfflineMode = () => {
    dispatch({ type: "SET_OFFLINE_MODE", payload: !state.isOfflineMode });
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
    showWarning,
    showInfo,
    setLoading,
    clearNotifications,
    toggleOfflineMode,
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
