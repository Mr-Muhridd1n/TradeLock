// src/hooks/useApi.js - To'g'irlangan versiya
import { useState, useEffect } from "react";
import { useTelegram } from "./useTelegram";
import {
  OfflineStorage,
  defaultUser,
  defaultTrades,
  defaultPayments,
} from "../utils/offlineStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://mr-muhridd1n.uz/api";

export const useApi = () => {
  const { tg, getUserData, isReady } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(
    OfflineStorage.load(OfflineStorage.KEYS.AUTH_TOKEN)
  );
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  useEffect(() => {
    // Online/offline holatini kuzatish
    const handleOnline = () => {
      setIsOfflineMode(false);
      console.log("🌐 Network online");
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
      console.log("📴 Network offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const authenticateUser = async () => {
      // Agar token mavjud bo'lsa, darhol authenticated qilib qo'yamiz
      if (token && token !== "offline_mock_token") {
        console.log("✅ Using existing token");
        setIsAuthenticated(true);
        return;
      }

      // Offline mode yoki Telegram ma'lumotlari yo'q bo'lsa, default user bilan ishlayamiz
      if (isOfflineMode || !tg || !tg.initData) {
        console.log("🔄 Using offline mode with default user");
        OfflineStorage.initDefaults();
        setToken("offline_mock_token");
        OfflineStorage.save(
          OfflineStorage.KEYS.AUTH_TOKEN,
          "offline_mock_token"
        );
        setIsAuthenticated(true);
        return;
      }

      try {
        // Online rejimda API ga ulanishga harakat qilamiz
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 soniya timeout

        const response = await fetch(`${API_BASE_URL}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData: tg.initData,
            userData: getUserData(),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API response:", result);

        if (result.success && result.data && result.data.token) {
          const { token: newToken, user } = result.data;

          console.log("✅ Online authentication successful");
          setToken(newToken);
          OfflineStorage.save(OfflineStorage.KEYS.AUTH_TOKEN, newToken);
          if (user) {
            OfflineStorage.save(OfflineStorage.KEYS.USER, user);
          }
          setIsAuthenticated(true);
        } else {
          throw new Error(result.error || "Authentication failed");
        }
      } catch (error) {
        console.log(
          "⚠️ API authentication failed, using offline mode:",
          error.message
        );
        // API ga ulanib bo'lmasa, offline rejimga o'tamiz
        OfflineStorage.initDefaults();
        setToken("offline_mock_token");
        OfflineStorage.save(
          OfflineStorage.KEYS.AUTH_TOKEN,
          "offline_mock_token"
        );
        setIsAuthenticated(true);
        setIsOfflineMode(true);
      }
    };

    authenticateUser();
  }, [tg, token, isOfflineMode, getUserData]);

  const apiCall = async (endpoint, options = {}) => {
    // Offline rejimda mock data bilan ishlash
    if (isOfflineMode || token === "offline_mock_token") {
      return handleOfflineApiCall(endpoint, options);
    }

    const url = `${API_BASE_URL}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token && token !== "offline_mock_token") {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 soniya timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        console.log("🔄 Token expired, re-authenticating...");
        setIsAuthenticated(false);
        setToken(null);
        OfflineStorage.remove(OfflineStorage.KEYS.AUTH_TOKEN);
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Call error:", error);

      // Network xatosi yoki timeout bo'lsa, offline rejimga o'tamiz
      if (
        error.name === "AbortError" ||
        error.name === "NetworkError" ||
        error.message.includes("fetch")
      ) {
        console.log("🔄 Switching to offline mode due to network error");
        setIsOfflineMode(true);
        return handleOfflineApiCall(endpoint, options);
      }

      throw error;
    }
  };

  // Offline API calls uchun mock handler
  const handleOfflineApiCall = async (endpoint, options = {}) => {
    console.log(`🔄 Offline API call: ${endpoint}`);

    // Kichik kechikish qo'shamiz, real API kabi ko'rinishi uchun
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 700)
    );

    const { method = "GET", body } = options;
    const [baseEndpoint, ...pathParts] = endpoint.split("/");

    switch (baseEndpoint) {
      case "auth":
        if (method === "POST") {
          return {
            success: true,
            data: {
              token: "offline_mock_token",
              user: OfflineStorage.load(OfflineStorage.KEYS.USER, defaultUser),
            },
          };
        }
        break;

      case "user":
        return handleUserEndpoint(method, body, pathParts);

      case "trade":
        return handleTradeEndpoint(endpoint, method, body, pathParts);

      case "payment":
        return handlePaymentEndpoint(method, body);

      default:
        throw new Error(`Unknown offline endpoint: ${endpoint}`);
    }

    throw new Error(`Offline method ${method} not supported for ${endpoint}`);
  };

  // User endpoint handler
  const handleUserEndpoint = (method, body, pathParts) => {
    const currentUser = OfflineStorage.load(
      OfflineStorage.KEYS.USER,
      defaultUser
    );

    if (method === "GET") {
      return {
        success: true,
        data: currentUser,
      };
    } else if (method === "PUT") {
      const updates = JSON.parse(body);

      if (pathParts[0] === "settings") {
        // Settings yangilash
        const updatedUser = {
          ...currentUser,
          settings: { ...currentUser.settings, ...updates },
          updated_at: new Date().toISOString(),
        };
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
        return {
          success: true,
          data: updatedUser,
        };
      } else {
        // Profile yangilash
        const updatedUser = {
          ...currentUser,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
        return {
          success: true,
          data: updatedUser,
        };
      }
    }
  };

  // Trade endpoint handler
  const handleTradeEndpoint = (endpoint, method, body, pathParts) => {
    const currentTrades = OfflineStorage.load(
      OfflineStorage.KEYS.TRADES,
      defaultTrades
    );
    const currentUser = OfflineStorage.load(
      OfflineStorage.KEYS.USER,
      defaultUser
    );

    if (method === "GET") {
      const urlParams = new URLSearchParams(endpoint.split("?")[1]);
      const status = urlParams.get("status");

      if (pathParts.length > 0 && pathParts[0] !== "") {
        // Specific trade by ID or secret link
        const tradeId = pathParts[0];
        const trade = currentTrades.find(
          (t) => t.id.toString() === tradeId || t.secret_link === tradeId
        );
        if (!trade) {
          throw new Error("Savdo topilmadi");
        }
        return {
          success: true,
          data: trade,
        };
      }

      // Filter by status
      let filteredTrades = currentTrades;
      if (status && status !== "all") {
        filteredTrades = currentTrades.filter((trade) => {
          if (status === "active")
            return ["active", "in_progress"].includes(trade.status);
          if (status === "completed") return trade.status === "completed";
          if (status === "cancelled") return trade.status === "cancelled";
          return trade.status === status;
        });
      }

      return {
        success: true,
        data: filteredTrades,
      };
    } else if (method === "POST") {
      const tradeData = JSON.parse(body);

      if (tradeData.join_link) {
        // Join trade
        const trade = currentTrades.find(
          (t) => t.secret_link === tradeData.join_link
        );
        if (!trade) {
          throw new Error("Savdo topilmadi yoki faol emas");
        }
        if (trade.participant_id) {
          throw new Error("Bu savdoda allaqachon ishtirokchi bor");
        }
        if (trade.creator_id === currentUser.id) {
          throw new Error("O'z savdongizga qo'shila olmaysiz");
        }

        const updatedTrade = {
          ...trade,
          participant_id: currentUser.id,
          participant_name: `${currentUser.first_name} ${currentUser.last_name}`,
          participant_username: currentUser.username,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        };

        const updatedTrades = currentTrades.map((t) =>
          t.id === trade.id ? updatedTrade : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);

        return {
          success: true,
          data: updatedTrade,
        };
      } else {
        // Create new trade
        const newTrade = {
          id: Date.now(),
          creator_id: currentUser.id,
          participant_id: null,
          ...tradeData,
          commission_amount: (parseFloat(tradeData.amount) * 2) / 100,
          status: "active",
          creator_confirmed: false,
          participant_confirmed: false,
          secret_link: generateSecretLink(),
          creator_name: `${currentUser.first_name} ${currentUser.last_name}`,
          creator_username: currentUser.username,
          participant_name: null,
          participant_username: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        newTrade.share_url = `https://t.me/Trade_Lock_bot?start=trade_${newTrade.secret_link}`;

        const updatedTrades = [newTrade, ...currentTrades];
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);

        return {
          success: true,
          data: newTrade,
        };
      }
    } else if (method === "PUT" && pathParts.length > 0) {
      const tradeId = parseInt(pathParts[0]);
      const actionData = JSON.parse(body);

      const trade = currentTrades.find((t) => t.id === tradeId);
      if (!trade) {
        throw new Error("Savdo topilmadi");
      }

      if (actionData.action === "confirm") {
        if (trade.creator_id === currentUser.id) {
          trade.creator_confirmed = true;
        } else if (trade.participant_id === currentUser.id) {
          trade.participant_confirmed = true;
        } else {
          throw new Error("Sizda bu savdoni tasdiqlash huquqi yo'q");
        }

        if (trade.creator_confirmed && trade.participant_confirmed) {
          trade.status = "completed";
          trade.completed_at = new Date().toISOString();
        }
      } else if (actionData.action === "cancel") {
        if (
          trade.creator_id !== currentUser.id &&
          trade.participant_id !== currentUser.id
        ) {
          throw new Error("Sizda bu savdoni bekor qilish huquqi yo'q");
        }
        trade.status = "cancelled";
        trade.cancelled_at = new Date().toISOString();
        trade.cancel_reason = actionData.reason || "Sabab ko'rsatilmagan";
      }

      trade.updated_at = new Date().toISOString();

      const updatedTrades = currentTrades.map((t) =>
        t.id === tradeId ? trade : t
      );
      OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);

      return {
        success: true,
        data: trade,
      };
    }
  };

  // Payment endpoint handler
  const handlePaymentEndpoint = (method, body) => {
    const currentPayments = OfflineStorage.load(
      OfflineStorage.KEYS.PAYMENTS,
      defaultPayments
    );
    const currentUser = OfflineStorage.load(
      OfflineStorage.KEYS.USER,
      defaultUser
    );

    if (method === "GET") {
      const userPayments = currentPayments.filter(
        (payment) => payment.user_id === currentUser.id
      );

      return {
        success: true,
        data: userPayments,
      };
    } else if (method === "POST") {
      const paymentData = JSON.parse(body);

      // Balance validation for withdraws
      if (
        paymentData.type === "withdraw" &&
        currentUser.balance < paymentData.amount
      ) {
        throw new Error("Yetarli balans yo'q");
      }

      const newPayment = {
        id: Date.now(),
        user_id: currentUser.id,
        ...paymentData,
        status: "pending",
        reference: generateReference(paymentData.type),
        created_at: new Date().toISOString(),
      };

      // Simulate processing
      setTimeout(() => {
        newPayment.status = "completed";
        newPayment.completed_at = new Date().toISOString();

        // Update user balance
        if (paymentData.type === "deposit") {
          currentUser.balance += paymentData.amount;
        } else if (paymentData.type === "withdraw") {
          currentUser.balance -= paymentData.amount;
        }

        OfflineStorage.save(OfflineStorage.KEYS.USER, currentUser);

        const updatedPayments = currentPayments.map((p) =>
          p.id === newPayment.id ? newPayment : p
        );
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);
      }, 2000);

      const updatedPayments = [newPayment, ...currentPayments];
      OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);

      return {
        success: true,
        data: newPayment,
      };
    }
  };

  return {
    isAuthenticated,
    token,
    apiCall,
    isOfflineMode,
  };
};

// Helper functions
const generateSecretLink = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const generateReference = (type) => {
  const prefixes = {
    deposit: "DEP",
    withdraw: "WTH",
    transfer: "TRF",
    commission: "COM",
    trade_earn: "TRADE",
    trade_pay: "TRADE",
  };

  const prefix = prefixes[type] || "TXN";
  const number = String(Date.now()).slice(-6);
  return `${prefix}${number}`;
};
