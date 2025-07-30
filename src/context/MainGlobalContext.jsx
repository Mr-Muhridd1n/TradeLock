// src/context/MainGlobalContext.jsx
import React, { createContext, useReducer, useEffect } from "react";

const GlobalContext = createContext();

const initialState = {
  user: null,
  trades: [],
  payments: [],
  notifications: [],
  isOfflineMode: false,
  lastSync: null,
};

const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_TRADES":
      return { ...state, trades: action.payload };
    case "SET_PAYMENTS":
      return { ...state, payments: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "SET_OFFLINE_MODE":
      return { ...state, isOfflineMode: action.payload };
    case "SET_LAST_SYNC":
      return { ...state, lastSync: action.payload };
    case "ADD_TRADE":
      return { ...state, trades: [action.payload, ...state.trades] };
    case "UPDATE_TRADE":
      return {
        ...state,
        trades: state.trades.map((trade) =>
          trade.id === action.payload.id ? action.payload : trade
        ),
      };
    case "ADD_PAYMENT":
      return { ...state, payments: [action.payload, ...state.payments] };
    case "UPDATE_USER_BALANCE":
      return {
        ...state,
        user: state.user ? { ...state.user, balance: action.payload } : null,
      };
    default:
      return state;
  }
};

export const MainGlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // localStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedUser = localStorage.getItem("tradelock_user");
        const storedTrades = localStorage.getItem("tradelock_trades");
        const storedPayments = localStorage.getItem("tradelock_payments");

        if (storedUser) {
          dispatch({ type: "SET_USER", payload: JSON.parse(storedUser) });
        }
        if (storedTrades) {
          dispatch({ type: "SET_TRADES", payload: JSON.parse(storedTrades) });
        }
        if (storedPayments) {
          dispatch({
            type: "SET_PAYMENTS",
            payload: JSON.parse(storedPayments),
          });
        }

        // Offline mode ni aniqlash
        dispatch({ type: "SET_OFFLINE_MODE", payload: !navigator.onLine });
      } catch (error) {
        console.error("Error loading from storage:", error);
      }
    };

    loadFromStorage();

    // Online/offline hodisalarini kuzatish
    const handleOnline = () =>
      dispatch({ type: "SET_OFFLINE_MODE", payload: false });
    const handleOffline = () =>
      dispatch({ type: "SET_OFFLINE_MODE", payload: true });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Ma'lumotlarni localStorage ga saqlash
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("tradelock_user", JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    if (state.trades.length > 0) {
      localStorage.setItem("tradelock_trades", JSON.stringify(state.trades));
    }
  }, [state.trades]);

  useEffect(() => {
    if (state.payments.length > 0) {
      localStorage.setItem(
        "tradelock_payments",
        JSON.stringify(state.payments)
      );
    }
  }, [state.payments]);

  const value = {
    ...state,
    dispatch,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext };

// src/utils/mockData.js - Default ma'lumotlar
export const defaultUser = {
  id: 12345,
  telegram_id: "123456789",
  username: "test_user",
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  phone: "+998901234567",
  balance: 1250000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  settings: {
    balance_hide: false,
    theme: "light",
    language: "uz",
    push_notifications: true,
    email_notifications: false,
    sms_notifications: false,
    two_factor_enabled: false,
    privacy_mode: false,
  },
  stats: {
    total_trades: 45,
    active_trades: 3,
    completed_trades: 40,
    cancelled_trades: 2,
    success_rate: 95.5,
    total_volume: 15750000,
    commission_paid: 315000,
    commission_earned: 278000,
  },
  verification: {
    email_verified: true,
    phone_verified: true,
    identity_verified: false,
    level: 1,
  },
};

export const defaultTrades = [
  {
    id: 1001,
    creator_id: 12345,
    participant_id: null,
    trade_type: "sell",
    trade_name: "iPhone 15 Pro Max 256GB",
    amount: 18500000,
    commission_type: "creator",
    commission_amount: 370000,
    status: "active",
    creator_confirmed: false,
    participant_confirmed: false,
    secret_link: "abc123def456",
    share_url: "https://t.me/Trade_Lock_bot?start=trade_abc123def456",
    creator_name: "Test User",
    creator_username: "test_user",
    participant_name: null,
    participant_username: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 soat oldin
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 kun keyingi
  },
  {
    id: 1002,
    creator_id: 67890,
    participant_id: 12345,
    trade_type: "buy",
    trade_name: "MacBook Air M2",
    amount: 22000000,
    commission_type: "split",
    commission_amount: 440000,
    status: "in_progress",
    creator_confirmed: true,
    participant_confirmed: false,
    secret_link: "xyz789abc123",
    share_url: null,
    creator_name: "Seller User",
    creator_username: "seller_user",
    participant_name: "Test User",
    participant_username: "test_user",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 kun oldin
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 soat oldin
    expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 1003,
    creator_id: 12345,
    participant_id: 11111,
    trade_type: "sell",
    trade_name: "Samsung Galaxy S24 Ultra",
    amount: 16800000,
    commission_type: "participant",
    commission_amount: 336000,
    status: "completed",
    creator_confirmed: true,
    participant_confirmed: true,
    secret_link: "completed123",
    share_url: null,
    creator_name: "Test User",
    creator_username: "test_user",
    participant_name: "Buyer User",
    participant_username: "buyer_user",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 5.5 * 60 * 60 * 1000
    ).toISOString(),
    completed_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 5.5 * 60 * 60 * 1000
    ).toISOString(),
    expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const defaultPayments = [
  {
    id: 2001,
    user_id: 12345,
    type: "deposit",
    amount: 500000,
    status: "completed",
    payment_method: "humo",
    card_number: "9860****1234",
    reference: "DEP001",
    description: "Hisob to'ldirish",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 daqiqa oldin
    completed_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 daqiqa oldin
  },
  {
    id: 2002,
    user_id: 12345,
    type: "trade_earn",
    amount: 336000,
    status: "completed",
    trade_id: 1003,
    reference: "TRADE1003",
    description: "Savdo #1003 dan daromad",
    created_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 5.5 * 60 * 60 * 1000
    ).toISOString(),
    completed_at: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 5.5 * 60 * 60 * 1000
    ).toISOString(),
  },
  {
    id: 2003,
    user_id: 12345,
    type: "commission",
    amount: 220000,
    status: "completed",
    trade_id: 1002,
    reference: "COM1002",
    description: "Savdo #1002 komissiyasi",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
