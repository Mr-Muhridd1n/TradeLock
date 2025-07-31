// src/context/ApiContext.jsx
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
  const { user: telegramUser, isReady } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication
  const { mutate: authenticate, isPending: authPending } = useMutation({
    mutationFn: (telegramData) => api.authenticateWithTelegram(telegramData),
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
        showToast.success("Muvaffaqiyatli tizimga kirdingiz");
      }
    },
    onError: (error) => {
      console.error("Auth error:", error);
      showToast.error("Tizimga kirishda xatolik");
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });

  // Auto authenticate when Telegram is ready
  useEffect(() => {
    if (isReady) {
      if (telegramUser && !isAuthenticated) {
        // Agar telegram user bor va authentifikatsiya qilinmagan bo'lsa
        authenticate({
          user: telegramUser,
          hash: window.Telegram?.WebApp?.initData
            ? new URLSearchParams(window.Telegram.WebApp.initData).get("hash")
            : "demo_hash",
        });
      } else if (!telegramUser && !isAuthenticated) {
        // Demo mode uchun
        setAuthLoading(false);
      } else {
        setAuthLoading(false);
      }
    }
  }, [isReady, telegramUser, isAuthenticated, authenticate]);

  // User queries
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getUser(),
    enabled: isAuthenticated,
    retry: 1,
  });

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: () => api.getUserBalance(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Har 30 soniyada yangilanadi
    retry: 1,
  });

  // Trade queries
  const { data: tradesData, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: () => api.getTrades(),
    enabled: isAuthenticated,
    retry: 1,
  });

  // Trade mutations
  const createTradeMutation = useMutation({
    mutationFn: (tradeData) => api.createTrade(tradeData),
    onSuccess: () => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
    },
  });

  const joinTradeMutation = useMutation({
    mutationFn: (secretCode) => api.joinTrade(secretCode),
    onSuccess: () => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
    },
  });

  const completeTradeMutation = useMutation({
    mutationFn: (tradeId) => api.completeTrade(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });

  const cancelTradeMutation = useMutation({
    mutationFn: (tradeId) => api.cancelTrade(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries(["trades"]);
      queryClient.invalidateQueries(["balance"]);
    },
  });

  // Transaction queries
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.getTransactions(),
    enabled: isAuthenticated,
    retry: 1,
  });

  const { data: transactionStats } = useQuery({
    queryKey: ["transactionStats"],
    queryFn: () => api.getTransactionStats(),
    enabled: isAuthenticated,
    retry: 1,
  });

  // Payment queries
  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => api.getPaymentMethods(),
    enabled: isAuthenticated,
    retry: 1,
  });

  // Payment mutations
  const depositMutation = useMutation({
    mutationFn: ({ amount, paymentMethodId, referenceId }) =>
      api.deposit(amount, paymentMethodId, referenceId),
    onSuccess: () => {
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: ({ amount, cardNumber }) => api.withdraw(amount, cardNumber),
    onSuccess: () => {
      queryClient.invalidateQueries(["balance"]);
      queryClient.invalidateQueries(["transactions"]);
    },
  });

  // Logout function
  const logout = () => {
    api.removeToken();
    setIsAuthenticated(false);
    queryClient.clear();
    showToast.info("Tizimdan chiqdingiz");
  };

  const value = {
    // State
    isAuthenticated,
    authLoading: authLoading || authPending,
    user: userData,
    balance: balanceData?.balance || 0,
    frozenBalance: balanceData?.frozen_balance || 0,
    availableBalance: balanceData?.available_balance || 0,
    trades: tradesData || [],
    transactions: transactionsData || [],
    transactionStats: transactionStats || {},
    paymentMethods: paymentMethods || [],

    // Loading states
    isLoading:
      userLoading || tradesLoading || transactionsLoading || balanceLoading,

    // Mutations
    createTrade: createTradeMutation.mutate,
    joinTrade: joinTradeMutation.mutate,
    completeTrade: completeTradeMutation.mutate,
    cancelTrade: cancelTradeMutation.mutate,
    deposit: depositMutation.mutate,
    withdraw: withdrawMutation.mutate,

    // Mutation loading states
    isCreatingTrade: createTradeMutation.isPending,
    isJoiningTrade: joinTradeMutation.isPending,
    isCompletingTrade: completeTradeMutation.isPending,
    isCancelingTrade: cancelTradeMutation.isPending,
    isDepositing: depositMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,

    // Actions
    logout,
    authenticate,

    // Refresh functions
    refreshTrades: () => queryClient.invalidateQueries(["trades"]),
    refreshBalance: () => queryClient.invalidateQueries(["balance"]),
    refreshTransactions: () => queryClient.invalidateQueries(["transactions"]),
    refreshAll: () => queryClient.invalidateQueries(),

    // Admin functions
    isAdmin: api.isAdmin(),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
