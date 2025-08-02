// src/context/ApiContext.jsx - URL parametrlarini qo'llab-quvvatlash bilan
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useTelegram } from "../hooks/useTelegram";
import { showToast } from "../utils/toast";

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return context;
};

export const ApiProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const {
    user: telegramUser,
    isReady,
    getUrlParams,
    isTelegramWebApp,
  } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
  const [authLoading, setAuthLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);

  // API holatini tekshirish
  useEffect(() => {
    const checkApiStatus = async () => {
      const isOnline = await api.checkApiStatus();
      setApiOnline(isOnline);
      if (!isOnline) {
        showToast.error(
          "Server bilan aloqa yo'q. Iltimos, keyinroq urinib ko'ring."
        );
      }
    };

    checkApiStatus();
    // Har 30 soniyada tekshirish
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Authentication
  const { mutate: authenticate, isPending: authPending } = useMutation({
    mutationFn: (telegramData) => api.authenticateWithTelegram(telegramData),
    onSuccess: (data) => {
      console.log("Auth response:", data);
      if (data && data.success) {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
        showToast.success("Muvaffaqiyatli tizimga kirdingiz");
      } else {
        throw new Error(data?.error || "Noma'lum xatolik");
      }
    },
    onError: (error) => {
      console.error("Auth error:", error);
      showToast.error(error.message || "Tizimga kirishda xatolik");
      setIsAuthenticated(false);
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });

  // Auto authenticate
  useEffect(() => {
    if (isReady && apiOnline) {
      // URL parametrlarini olish
      const urlParams = getUrlParams();
      console.log("URL params for auth:", urlParams);

      if (telegramUser && !isAuthenticated) {
        // Real Telegram data bilan auth
        const authData = {
          user: telegramUser,
          hash: window.Telegram?.WebApp?.initData
            ? new URLSearchParams(window.Telegram.WebApp.initData).get("hash")
            : "demo_hash",
          url_params: urlParams, // URL parametrlarini qo'shish
        };
        console.log("Authenticating with Telegram data:", authData);
        authenticate(authData);
      } else if (!telegramUser && !isAuthenticated) {
        // Demo mode
        const demoData = {
          user: {
            id: 123456789,
            first_name: "Demo",
            last_name: "User",
            username: "demo_user",
          },
          hash: "demo_hash",
          url_params: urlParams, // URL parametrlarini demo mode da ham qo'shish
        };
        console.log("Authenticating with demo data:", demoData);
        authenticate(demoData);
      } else {
        setAuthLoading(false);
      }
    }
  }, [
    isReady,
    telegramUser,
    isAuthenticated,
    authenticate,
    apiOnline,
    getUrlParams,
  ]);

  // Queries with error handling
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getUser(),
    enabled: isAuthenticated && apiOnline,
    retry: (failureCount, error) => {
      // 401 da retry qilmaslik
      if (error?.message?.includes("401")) return false;
      return failureCount < 2;
    },
    onError: (error) => {
      console.error("User data error:", error);
      if (!error.message.includes("401")) {
        showToast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik");
      }
    },
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: () => api.getUserBalance(),
    enabled: isAuthenticated && apiOnline,
    refetchInterval: 30000,
    retry: 2,
    onError: (error) => {
      console.error("Balance error:", error);
    },
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: () => api.getTrades(),
    enabled: isAuthenticated && apiOnline,
    retry: 2,
    onError: (error) => {
      console.error("Trades error:", error);
    },
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.getTransactions(50, 0),
    enabled: isAuthenticated && apiOnline,
    retry: 2,
    onError: (error) => {
      console.error("Transactions error:", error);
    },
  });

  // Trade mutations with proper error handling
  const createTradeMutation = useMutation({
    mutationFn: (tradeData) => api.createTrade(tradeData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
      showToast.success("Savdo muvaffaqiyatli yaratildi");
      return data;
    },
    onError: (error) => {
      console.error("Create trade error:", error);
      showToast.error(error.message || "Savdo yaratishda xatolik");
    },
  });

  const joinTradeMutation = useMutation({
    mutationFn: (secretCode) => api.joinTrade(secretCode),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
      showToast.success("Savdoga muvaffaqiyatli qo'shildingiz");
      return data;
    },
    onError: (error) => {
      console.error("Join trade error:", error);
      showToast.error(error.message || "Savdoga qo'shilishda xatolik");
    },
  });

  const completeTradeMutation = useMutation({
    mutationFn: (tradeId) => api.completeTrade(tradeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
      showToast.success("Savdo muvaffaqiyatli yakunlandi");
      return data;
    },
    onError: (error) => {
      console.error("Complete trade error:", error);
      showToast.error(error.message || "Savdoni yakunlashda xatolik");
    },
  });

  const cancelTradeMutation = useMutation({
    mutationFn: (tradeId) => api.cancelTrade(tradeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
      showToast.success("Savdo bekor qilindi");
      return data;
    },
    onError: (error) => {
      console.error("Cancel trade error:", error);
      showToast.error(error.message || "Savdoni bekor qilishda xatolik");
    },
  });

  const depositMutation = useMutation({
    mutationFn: ({ amount, paymentMethodId, referenceId }) =>
      api.deposit(amount, paymentMethodId, referenceId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
      showToast.success("Mablag' muvaffaqiyatli qo'shildi");
      return data;
    },
    onError: (error) => {
      console.error("Deposit error:", error);
      showToast.error(error.message || "To'lovda xatolik");
    },
  });

  // Trade functions with Promise wrapping
  const createTrade = (tradeData) => {
    return new Promise((resolve, reject) => {
      createTradeMutation.mutate(tradeData, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  const joinTrade = (secretCode) => {
    return new Promise((resolve, reject) => {
      joinTradeMutation.mutate(secretCode, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  const completeTrade = (tradeId) => {
    return new Promise((resolve, reject) => {
      completeTradeMutation.mutate(tradeId, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  const cancelTrade = (tradeId) => {
    return new Promise((resolve, reject) => {
      cancelTradeMutation.mutate(tradeId, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  const deposit = (depositData) => {
    return new Promise((resolve, reject) => {
      depositMutation.mutate(depositData, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  // Trade code bo'yicha savdo olish
  const getTradeByCode = async (secretCode) => {
    try {
      console.log("Getting trade by code:", secretCode);
      return await api.getTradeBySecretCode(secretCode);
    } catch (error) {
      console.error("Error getting trade by code:", error);
      throw error;
    }
  };

  const value = {
    // State
    isAuthenticated,
    authLoading: authLoading || authPending,
    apiOnline,
    user: userData,
    balance: balanceData?.balance || 0,
    frozenBalance: balanceData?.frozen_balance || 0,
    availableBalance: balanceData?.available_balance || 0,
    trades: tradesData || [],
    transactions: transactionsData || [],

    // Loading states
    isLoading:
      userLoading || tradesLoading || balanceLoading || transactionsLoading,

    // Functions
    createTrade,
    joinTrade,
    completeTrade,
    cancelTrade,
    deposit,
    getTradeByCode,

    // Direct mutations (keeping for compatibility)
    createTradeMutation: createTradeMutation.mutate,
    isCreatingTrade: createTradeMutation.isPending,
    isJoiningTrade: joinTradeMutation.isPending,
    isCompletingTrade: completeTradeMutation.isPending,
    isCancelingTrade: cancelTradeMutation.isPending,
    isDepositing: depositMutation.isPending,

    // Platform info
    isTelegramWebApp: isTelegramWebApp(),
    urlParams: getUrlParams(),

    // Utility
    logout: () => {
      api.removeToken();
      setIsAuthenticated(false);
      queryClient.clear();
      showToast.info("Tizimdan chiqdingiz");
    },
  };

  // Loading screen during auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Tizimga kirish...</p>
          {isTelegramWebApp() && (
            <p className="text-sm text-blue-600 mt-2">Telegram WebApp</p>
          )}
        </div>
      </div>
    );
  }

  // Offline screen
  if (!apiOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Server bilan aloqa yo'q
          </h2>
          <p className="text-gray-600 mb-4">
            Iltimos, internet aloqasini tekshiring
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
