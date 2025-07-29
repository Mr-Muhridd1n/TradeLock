// src/hooks/useTrades.js
import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useTrades = (status = "all") => {
  const { apiCall, isAuthenticated } = useApi();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const tradesData = await apiCall(`trade?status=${status}`);
      setTrades(tradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrade = async (tradeData) => {
    try {
      const newTrade = await apiCall("trade", {
        method: "POST",
        body: JSON.stringify(tradeData),
      });
      await fetchTrades(); // Refresh trades list
      return newTrade;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const joinTrade = async (secretLink) => {
    try {
      const result = await apiCall("trade", {
        method: "POST",
        body: JSON.stringify({ join_link: secretLink }),
      });
      await fetchTrades(); // Refresh trades list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const confirmTrade = async (tradeId) => {
    try {
      const result = await apiCall(`trade/${tradeId}`, {
        method: "PUT",
        body: JSON.stringify({ action: "confirm" }),
      });
      await fetchTrades(); // Refresh trades list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelTrade = async (tradeId) => {
    try {
      const result = await apiCall(`trade/${tradeId}`, {
        method: "PUT",
        body: JSON.stringify({ action: "cancel" }),
      });
      await fetchTrades(); // Refresh trades list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTradeById = async (tradeId) => {
    try {
      return await apiCall(`trade/${tradeId}`);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [status, isAuthenticated]);

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
