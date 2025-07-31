// src/context/ApiContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useTelegram } from "../hooks/useTelegram";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication
  const { mutate: authenticate } = useMutation({
    mutationFn: (telegramData) => api.authenticateWithTelegram(telegramData),
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        queryClient.invalidateQueries(["user"]);
      }
    },
  });

  // Auto authenticate when Telegram is ready
  useEffect(() => {
    if (isReady && telegramUser && !isAuthenticated) {
      authenticate({ user: telegramUser });
    }
  }, [isReady, telegramUser, isAuthenticated, authenticate]);

  // User queries
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getUser(),
    enabled: isAuthenticated,
  });

  const { data: balanceData } = useQuery({
    queryKey: ["balance"],
    queryFn: () => api.getUserBalance(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Trade queries
  const { data: trades, isLoading: tradesLoading } = useQuery({
    queryKey: ["trades"],
    queryFn: () => api.getTrades(),
    enabled: isAuthenticated,
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
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.getTransactions(),
    enabled: isAuthenticated,
  });

  const { data: transactionStats } = useQuery({
    queryKey: ["transactionStats"],
    queryFn: () => api.getTransactionStats(),
    enabled: isAuthenticated,
  });

  // Payment queries
  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => api.getPaymentMethods(),
    enabled: isAuthenticated,
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

  const value = {
    // State
    isAuthenticated,
    user: userData?.user,
    balance: balanceData?.balance || 0,
    frozenBalance: balanceData?.frozen_balance || 0,
    availableBalance: balanceData?.available_balance || 0,
    trades: trades || [],
    transactions: transactions || [],
    transactionStats: transactionStats || {},
    paymentMethods: paymentMethods || [],

    // Loading states
    isLoading: userLoading || tradesLoading || transactionsLoading,

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

    // Refresh functions
    refreshTrades: () => queryClient.invalidateQueries(["trades"]),
    refreshBalance: () => queryClient.invalidateQueries(["balance"]),
    refreshTransactions: () => queryClient.invalidateQueries(["transactions"]),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
