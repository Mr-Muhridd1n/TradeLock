// src/hooks/useTrades.js - Yangilangan versiya
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { OfflineStorage, defaultTrades } from "../utils/offlineStorage";

export const useTrades = (status = "all") => {
  const { apiCall, isAuthenticated, isOfflineMode } = useApi();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      let tradesData;
      if (isOfflineMode) {
        // Offline rejimda localStorage dan olish
        const allTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );
        tradesData = filterTradesByStatus(allTrades, status);
        console.log("📱 Loading trades from offline storage");
      } else {
        // Online rejimda API dan olish
        tradesData = await apiCall(`trade?status=${status}`);
        // Ma'lumotlarni localStorage ga saqlash
        if (status === "all") {
          OfflineStorage.save(OfflineStorage.KEYS.TRADES, tradesData);
        }
      }

      setTrades(tradesData);
    } catch (err) {
      console.error("Failed to fetch trades:", err);
      setError(err.message);

      // Xato bo'lsa, offline ma'lumotlarni ishlatishga harakat qilish
      const cachedTrades = OfflineStorage.load(OfflineStorage.KEYS.TRADES);
      if (cachedTrades) {
        console.log("📱 Using cached trades after API error");
        const filteredTrades = filterTradesByStatus(cachedTrades, status);
        setTrades(filteredTrades);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterTradesByStatus = (trades, statusFilter) => {
    if (statusFilter === "all") return trades;

    return trades.filter((trade) => {
      switch (statusFilter) {
        case "active":
          return ["active", "in_progress"].includes(trade.status);
        case "completed":
          return trade.status === "completed";
        case "cancelled":
          return trade.status === "cancelled";
        default:
          return true;
      }
    });
  };

  const createTrade = async (tradeData) => {
    try {
      setError(null);

      let newTrade;
      if (isOfflineMode) {
        // Offline rejimda localStorage ga saqlash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);

        newTrade = {
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
          pending_sync: true, // Sinxronizatsiya uchun belgilash
        };

        newTrade.share_url = `https://t.me/Trade_Lock_bot?start=trade_${newTrade.secret_link}`;

        const updatedTrades = [newTrade, ...currentTrades];
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
        console.log("📱 Created trade offline");
      } else {
        // Online rejimda API ga yuborish
        newTrade = await apiCall("trade", {
          method: "POST",
          body: JSON.stringify(tradeData),
        });

        // localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          []
        );
        const updatedTrades = [newTrade, ...currentTrades];
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
      }

      await fetchTrades(); // Ro'yxatni yangilash
      return newTrade;
    } catch (err) {
      console.error("Failed to create trade:", err);
      setError(err.message);
      throw err;
    }
  };

  const joinTrade = async (secretLink) => {
    try {
      setError(null);

      let result;
      if (isOfflineMode) {
        // Offline rejimda localStorage dan topish va yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);

        const trade = currentTrades.find((t) => t.secret_link === secretLink);
        if (!trade) {
          throw new Error("Savdo topilmadi yoki faol emas");
        }
        if (trade.participant_id) {
          throw new Error("Bu savdoda allaqachon ishtirokchi bor");
        }

        const updatedTrade = {
          ...trade,
          participant_id: currentUser.id,
          participant_name: `${currentUser.first_name} ${currentUser.last_name}`,
          participant_username: currentUser.username,
          status: "in_progress",
          updated_at: new Date().toISOString(),
          pending_sync: true,
        };

        const updatedTrades = currentTrades.map((t) =>
          t.id === trade.id ? updatedTrade : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
        result = updatedTrade;
        console.log("📱 Joined trade offline");
      } else {
        // Online rejimda API ga yuborish
        result = await apiCall("trade", {
          method: "POST",
          body: JSON.stringify({ join_link: secretLink }),
        });

        // localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          []
        );
        const updatedTrades = currentTrades.map((t) =>
          t.id === result.id ? result : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
      }

      await fetchTrades(); // Ro'yxatni yangilash
      return result;
    } catch (err) {
      console.error("Failed to join trade:", err);
      setError(err.message);
      throw err;
    }
  };

  const confirmTrade = async (tradeId) => {
    try {
      setError(null);

      let result;
      if (isOfflineMode) {
        // Offline rejimda localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);

        const trade = currentTrades.find((t) => t.id === tradeId);
        if (!trade) {
          throw new Error("Savdo topilmadi");
        }

        // Confirmation statusini yangilash
        if (trade.creator_id === currentUser.id) {
          trade.creator_confirmed = true;
        } else {
          trade.participant_confirmed = true;
        }

        // Agar ikki tomon ham tasdiqlasa, completed qilish
        if (trade.creator_confirmed && trade.participant_confirmed) {
          trade.status = "completed";
          trade.completed_at = new Date().toISOString();
        }

        trade.updated_at = new Date().toISOString();
        trade.pending_sync = true;

        const updatedTrades = currentTrades.map((t) =>
          t.id === tradeId ? trade : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
        result = trade;
        console.log("📱 Confirmed trade offline");
      } else {
        // Online rejimda API ga yuborish
        result = await apiCall(`trade/${tradeId}`, {
          method: "PUT",
          body: JSON.stringify({ action: "confirm" }),
        });

        // localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          []
        );
        const updatedTrades = currentTrades.map((t) =>
          t.id === tradeId ? result : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
      }

      await fetchTrades(); // Ro'yxatni yangilash
      return result;
    } catch (err) {
      console.error("Failed to confirm trade:", err);
      setError(err.message);
      throw err;
    }
  };

  const cancelTrade = async (tradeId) => {
    try {
      setError(null);

      let result;
      if (isOfflineMode) {
        // Offline rejimda localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );

        const trade = currentTrades.find((t) => t.id === tradeId);
        if (!trade) {
          throw new Error("Savdo topilmadi");
        }

        trade.status = "cancelled";
        trade.cancelled_at = new Date().toISOString();
        trade.updated_at = new Date().toISOString();
        trade.pending_sync = true;

        const updatedTrades = currentTrades.map((t) =>
          t.id === tradeId ? trade : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
        result = trade;
        console.log("📱 Cancelled trade offline");
      } else {
        // Online rejimda API ga yuborish
        result = await apiCall(`trade/${tradeId}`, {
          method: "PUT",
          body: JSON.stringify({ action: "cancel" }),
        });

        // localStorage ni yangilash
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          []
        );
        const updatedTrades = currentTrades.map((t) =>
          t.id === tradeId ? result : t
        );
        OfflineStorage.save(OfflineStorage.KEYS.TRADES, updatedTrades);
      }

      await fetchTrades(); // Ro'yxatni yangilash
      return result;
    } catch (err) {
      console.error("Failed to cancel trade:", err);
      setError(err.message);
      throw err;
    }
  };

  const getTradeById = async (tradeId) => {
    try {
      setError(null);

      if (isOfflineMode) {
        // Offline rejimda localStorage dan qidirish
        const currentTrades = OfflineStorage.load(
          OfflineStorage.KEYS.TRADES,
          defaultTrades
        );
        const trade = currentTrades.find(
          (t) => t.id.toString() === tradeId || t.secret_link === tradeId
        );
        if (!trade) {
          throw new Error("Savdo topilmadi");
        }
        return trade;
      } else {
        // Online rejimda API dan olish
        return await apiCall(`trade/${tradeId}`);
      }
    } catch (err) {
      console.error("Failed to get trade by ID:", err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [status, isAuthenticated, isOfflineMode]);

  return {
    trades,
    loading,
    error,
    createTrade,
    joinTrade,
    confirmTrade,
    cancelTrade,
    getTradeById,
    refetch: fetchTrades,
  };
};

// Helper function
const generateSecretLink = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
