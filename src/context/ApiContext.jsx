// src/context/ApiContext.jsx - Telegram WebApp uchun mukammal optimallashtirilgan
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
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // Telegram WebApp ekanligini tekshirish
  const isValidTelegramWebApp = () => {
    return !!(
      window.Telegram?.WebApp &&
      window.Telegram.WebApp.initData &&
      window.location.hostname !== "localhost"
    );
  };

  // Development mode ni aniqlash
  useEffect(() => {
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("192.168") ||
      window.location.protocol === "file:" ||
      !window.Telegram?.WebApp;

    setIsDevelopmentMode(isDev);
    console.log("Environment:", isDev ? "Development" : "Production");
    console.log("Telegram WebApp:", !!window.Telegram?.WebApp);
  }, []);

  // API holatini tekshirish
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const isOnline = await api.checkApiStatus();
        setApiOnline(isOnline);
        if (!isOnline && !isDevelopmentMode) {
          showToast.error("Server bilan aloqa yo'q");
        }
      } catch (error) {
        console.error("API status check failed:", error);
        setApiOnline(false);
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, [isDevelopmentMode]);

  // Authentication
  const { mutate: authenticate, isPending: authPending } = useMutation({
    mutationFn: (telegramData) => api.authenticateWithTelegram(telegramData),
    onSuccess: (data) => {
      console.log("Auth response:", data);
      if (data && data.success) {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
        if (!isDevelopmentMode) {
          showToast.success("Muvaffaqiyatli tizimga kirdingiz");
        }
      } else {
        throw new Error(data?.error || "Noma'lum xatolik");
      }
    },
    onError: (error) => {
      console.error("Auth error:", error);
      if (!isDevelopmentMode) {
        showToast.error(error.message || "Tizimga kirishda xatolik");
      }
      setIsAuthenticated(false);
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });

  // Auto authenticate
  useEffect(() => {
    if (isReady) {
      const urlParams = getUrlParams();
      console.log("URL params for auth:", urlParams);

      // Development mode da demo foydalanuvchi
      if (isDevelopmentMode) {
        const demoData = {
          user: {
            id: 123456789,
            first_name: "Demo",
            last_name: "User",
            username: "demo_user",
          },
          hash: "demo_hash",
          url_params: urlParams,
        };
        console.log("Development mode: Authenticating with demo data");
        authenticate(demoData);
        return;
      }

      // Production mode: faqat Telegram WebApp
      if (!isValidTelegramWebApp()) {
        console.error("Not a valid Telegram WebApp environment");
        setAuthLoading(false);
        return;
      }

      // Real Telegram data bilan auth
      if (telegramUser && !isAuthenticated && apiOnline) {
        const authData = {
          user: telegramUser,
          hash:
            new URLSearchParams(window.Telegram.WebApp.initData).get("hash") ||
            "no_hash",
          url_params: urlParams,
        };
        console.log("Authenticating with Telegram data:", authData);
        authenticate(authData);
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
    isDevelopmentMode,
    getUrlParams,
  ]);

  // Data fetching - faqat auth va online bo'lganda
  const shouldFetchData = isAuthenticated && (apiOnline || isDevelopmentMode);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (isDevelopmentMode && !apiOnline) {
        return {
          id: 1,
          telegram_id: 123456789,
          first_name: "Demo",
          last_name: "User",
          username: "demo_user",
          is_active: true,
        };
      }
      return api.getUser();
    },
    enabled: shouldFetchData,
    retry: false,
    onError: (error) => {
      console.error("User data error:", error);
      if (!error.message.includes("401") && !isDevelopmentMode) {
        showToast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik");
      }
    },
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: () => {
      if (isDevelopmentMode && !apiOnline) {
        return {
          balance: 100000000,
          frozen_balance: 5000000,
          available_balance: 95000000,
        };
      }
      return api.getUserBalance();
    },
    enabled: shouldFetchData,
    refetchInterval: isDevelopmentMode ? false : 30000,
    retry: false,
  });

  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: () => {
      if (isDevelopmentMode && !apiOnline) {
        return [
          {
            id: 1,
            secret_code: "TL123DEMO",
            trade_name: "Demo Savdo",
            amount: 100000,
            commission_amount: 2000,
            commission_type: "creator",
            creator_role: "seller",
            status: "active",
            partner_id: null,
            created_at: new Date().toISOString(),
          },
        ];
      }
      return api.getTrades();
    },
    enabled: shouldFetchData,
    retry: false,
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => {
      if (isDevelopmentMode && !apiOnline) {
        return [
          {
            id: 1,
            type: "deposit",
            amount: 50000,
            created_at: new Date().toISOString(),
            description: "Demo to'lov",
          },
        ];
      }
      return api.getTransactions(50, 0);
    },
    enabled: shouldFetchData,
    retry: false,
  });

  // Trade mutations
  const createTradeMutation = useMutation({
    mutationFn: (tradeData) => {
      if (isDevelopmentMode && !apiOnline) {
        return Promise.resolve({
          success: true,
          trade_id: Math.floor(Math.random() * 1000),
          secret_code:
            "TL" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        });
      }
      return api.createTrade(tradeData);
    },
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
    mutationFn: (secretCode) => {
      if (isDevelopmentMode && !apiOnline) {
        return Promise.resolve({
          success: true,
          trade: { id: 1, secret_code: secretCode },
        });
      }
      return api.joinTrade(secretCode);
    },
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
    mutationFn: (tradeId) => {
      if (isDevelopmentMode && !apiOnline) {
        return Promise.resolve({ success: true });
      }
      return api.completeTrade(tradeId);
    },
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
    mutationFn: (tradeId) => {
      if (isDevelopmentMode && !apiOnline) {
        return Promise.resolve({ success: true });
      }
      return api.cancelTrade(tradeId);
    },
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
    mutationFn: ({ amount, paymentMethodId, referenceId }) => {
      if (isDevelopmentMode && !apiOnline) {
        return Promise.resolve({ success: true });
      }
      return api.deposit(amount, paymentMethodId, referenceId);
    },
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

  // Promise wrapper functions
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
      if (isDevelopmentMode && !apiOnline) {
        return {
          id: 1,
          secret_code: secretCode,
          trade_name: "Demo Savdo",
          amount: 100000,
          commission_amount: 2000,
          commission_type: "creator",
          creator_role: "seller",
          status: "active",
          partner_id: null,
          created_at: new Date().toISOString(),
        };
      }
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
    isDevelopmentMode,
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

    // Mutation states
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
          <p className="text-gray-600">
            {isDevelopmentMode
              ? "Demo rejimi yuklanmoqda..."
              : "Tizimga kirish..."}
          </p>
          {isDevelopmentMode && (
            <p className="text-sm text-orange-600 mt-2">Development Mode</p>
          )}
          {!isDevelopmentMode && isTelegramWebApp() && (
            <p className="text-sm text-blue-600 mt-2">Telegram WebApp</p>
          )}
        </div>
      </div>
    );
  }

  // Production da Telegram WebApp emas bo'lsa
  if (!isDevelopmentMode && !isValidTelegramWebApp()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Noto'g'ri kirish
          </h2>
          <p className="text-gray-600 mb-4">
            Bu ilova faqat Telegram WebApp orqali ishlaydi
          </p>
          <a
            href="https://t.me/Trade_Lock_bot/app"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Telegram WebApp orqali ochish
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Brauzer orqali kirish mumkin emas
          </p>
        </div>
      </div>
    );
  }

  // Offline screen (production da)
  if (!isDevelopmentMode && !apiOnline) {
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
