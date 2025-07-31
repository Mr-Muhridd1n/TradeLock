// src/services/api.js
import { showToast } from "../utils/toast";

const API_BASE_URL = "https://mr-muhridd1n.uz/api";

// Mock data uchun localStorage
const MOCK_DATA_KEY = "tradeLockMockData";

// Demo data initialization
const initMockData = () => {
  if (!localStorage.getItem(MOCK_DATA_KEY)) {
    const mockData = {
      users: [
        {
          id: 1,
          telegram_id: 123456789,
          username: "demo_user",
          first_name: "Demo",
          last_name: "User",
          balance: 50000000,
          frozen_balance: 0,
          is_active: true,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          telegram_id: 987654321,
          username: "admin",
          first_name: "Admin",
          last_name: "User",
          balance: 100000000,
          frozen_balance: 0,
          is_active: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      trades: [
        {
          id: 1,
          secret_code: "TL1DEMO123",
          creator_id: 1,
          partner_id: null,
          trade_name: "Telegram kanal sotish",
          amount: 120000,
          commission_amount: 2400,
          commission_type: "creator",
          creator_role: "seller",
          status: "active",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 kun oldin
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          secret_code: "TL2DEMO456",
          creator_id: 1,
          partner_id: 2,
          trade_name: "Telefon sotish",
          amount: 2500000,
          commission_amount: 50000,
          commission_type: "split",
          creator_role: "seller",
          status: "completed",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 kun oldin
          completed_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      transactions: [
        {
          id: 1,
          user_id: 1,
          trade_id: null,
          type: "deposit",
          amount: 1000000,
          balance_before: 49000000,
          balance_after: 50000000,
          description: "Hisob to'ldirish",
          reference_id: "DEP_" + Date.now(),
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 kun oldin
        },
        {
          id: 2,
          user_id: 1,
          trade_id: 2,
          type: "trade_release",
          amount: 2500000,
          balance_before: 50000000,
          balance_after: 52500000,
          description: "Savdo #2 dan tushum",
          reference_id: null,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      paymentMethods: [
        {
          id: 1,
          user_id: 1,
          type: "humo",
          card_number: "9860****1234",
          card_holder_name: "Demo User",
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ],
    };
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(mockData));
  }
};

// Mock data utilities
const getMockData = () => {
  initMockData();
  return JSON.parse(localStorage.getItem(MOCK_DATA_KEY));
};

const setMockData = (data) => {
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
};

class ApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
    this.useMockData = true; // Development uchun mock data ishlatamiz
    initMockData();
  }

  // Token management
  setToken(token) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  }

  // Mock API request simulator
  async mockRequest(endpoint, options = {}) {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );

    const mockData = getMockData();
    const method = options.method || "GET";

    try {
      // Route handling
      if (endpoint === "/auth/telegram" && method === "POST") {
        const userData = mockData.users[0];
        const token = "mock_token_" + Date.now();
        this.setToken(token);
        if (userData.role === "admin") {
          localStorage.setItem("user_role", "admin");
        }
        return { success: true, token, user: userData };
      }

      if (endpoint === "/user" && method === "GET") {
        return mockData.users[0];
      }

      if (endpoint === "/user/balance" && method === "GET") {
        const user = mockData.users[0];
        return {
          balance: user.balance,
          frozen_balance: user.frozen_balance,
          available_balance: user.balance - user.frozen_balance,
        };
      }

      if (endpoint.startsWith("/trade/list") && method === "GET") {
        const url = new URL("http://example.com" + endpoint);
        const status = url.searchParams.get("status");
        let trades = mockData.trades;
        if (status) {
          trades = trades.filter((trade) => trade.status === status);
        }
        return trades.map((trade) => ({
          ...trade,
          creator_name: mockData.users.find((u) => u.id === trade.creator_id)
            ?.first_name,
          partner_name: trade.partner_id
            ? mockData.users.find((u) => u.id === trade.partner_id)?.first_name
            : null,
        }));
      }

      if (endpoint === "/trade/create" && method === "POST") {
        const tradeData = JSON.parse(options.body);
        const newTrade = {
          id: mockData.trades.length + 1,
          secret_code: "TL" + Date.now().toString(36).toUpperCase(),
          creator_id: 1,
          partner_id: null,
          trade_name: tradeData.trade_name,
          amount: parseInt(tradeData.amount),
          commission_amount: parseInt(tradeData.amount) * 0.02,
          commission_type: tradeData.commission_type,
          creator_role: tradeData.creator_role,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockData.trades.push(newTrade);
        setMockData(mockData);
        return {
          success: true,
          trade_id: newTrade.id,
          secret_code: newTrade.secret_code,
        };
      }

      if (endpoint === "/trade/join" && method === "POST") {
        const { secret_code } = JSON.parse(options.body);
        const trade = mockData.trades.find(
          (t) => t.secret_code === secret_code && t.status === "active"
        );

        if (!trade) {
          throw new Error("Savdo topilmadi yoki faol emas");
        }

        if (trade.partner_id) {
          throw new Error("Bu savdoga allaqachon qo'shilgan");
        }

        trade.partner_id = 2; // Mock partner
        trade.updated_at = new Date().toISOString();
        setMockData(mockData);

        return { success: true, trade };
      }

      if (endpoint === "/trade/complete" && method === "POST") {
        const { trade_id } = JSON.parse(options.body);
        const trade = mockData.trades.find((t) => t.id === trade_id);

        if (!trade) {
          throw new Error("Savdo topilmadi");
        }

        trade.status = "completed";
        trade.completed_at = new Date().toISOString();
        trade.updated_at = new Date().toISOString();
        setMockData(mockData);

        return { success: true };
      }

      if (endpoint === "/trade/cancel" && method === "POST") {
        const { trade_id } = JSON.parse(options.body);
        const trade = mockData.trades.find((t) => t.id === trade_id);

        if (!trade) {
          throw new Error("Savdo topilmadi");
        }

        trade.status = "cancelled";
        trade.cancelled_at = new Date().toISOString();
        trade.updated_at = new Date().toISOString();
        setMockData(mockData);

        return { success: true };
      }

      if (endpoint.startsWith("/transaction") && method === "GET") {
        return mockData.transactions;
      }

      if (endpoint.startsWith("/transaction/stats") && method === "GET") {
        const transactions = mockData.transactions;
        const income = transactions
          .filter((t) => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return {
          total_income: income,
          total_expense: expense,
          transaction_count: transactions.length,
          unique_trades: new Set(
            transactions.filter((t) => t.trade_id).map((t) => t.trade_id)
          ).size,
        };
      }

      if (endpoint === "/payment/methods" && method === "GET") {
        return mockData.paymentMethods;
      }

      // Admin endpoints
      if (endpoint === "/admin/stats" && method === "GET") {
        const users = mockData.users;
        const trades = mockData.trades;
        const transactions = mockData.transactions;

        return {
          totalUsers: users.length,
          activeTrades: trades.filter((t) => t.status === "active").length,
          completedTrades: trades.filter((t) => t.status === "completed")
            .length,
          cancelledTrades: trades.filter((t) => t.status === "cancelled")
            .length,
          totalVolume: trades.reduce((sum, t) => sum + t.amount, 0),
          totalCommission: trades.reduce(
            (sum, t) => sum + t.commission_amount,
            0
          ),
          userGrowth: 15,
          tradeGrowth: 23,
          volumeGrowth: 12,
          commissionGrowth: 18,
          recentTrades: trades.slice(-5).reverse(),
          recentUsers: users.slice(-5).reverse(),
          commissionRate: 2,
        };
      }

      throw new Error("Endpoint not found: " + endpoint);
    } catch (error) {
      throw error;
    }
  }

  // Main request method
  async request(endpoint, options = {}) {
    if (this.useMockData) {
      return this.mockRequest(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.removeToken();
        window.location.href = "/";
        throw new Error("Avtorizatsiya talab qilinadi");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API xatosi");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async authenticateWithTelegram(telegramData) {
    return this.request("/auth/telegram", {
      method: "POST",
      body: JSON.stringify(telegramData),
    });
  }

  // User endpoints
  async getUser() {
    return this.request("/user");
  }

  async getUserBalance() {
    return this.request("/user/balance");
  }

  // Trade endpoints
  async getTrades(status = null) {
    const query = status ? `?status=${status}` : "";
    return this.request(`/trade/list${query}`);
  }

  async getTradeById(id) {
    return this.request(`/trade/${id}`);
  }

  async getTradeBySecretCode(secretCode) {
    return this.request(`/trade/by-code/${secretCode}`);
  }

  async createTrade(tradeData) {
    return this.request("/trade/create", {
      method: "POST",
      body: JSON.stringify(tradeData),
    });
  }

  async joinTrade(secretCode) {
    return this.request("/trade/join", {
      method: "POST",
      body: JSON.stringify({ secret_code: secretCode }),
    });
  }

  async completeTrade(tradeId) {
    return this.request("/trade/complete", {
      method: "POST",
      body: JSON.stringify({ trade_id: tradeId }),
    });
  }

  async cancelTrade(tradeId) {
    return this.request("/trade/cancel", {
      method: "POST",
      body: JSON.stringify({ trade_id: tradeId }),
    });
  }

  // Transaction endpoints
  async getTransactions(limit = 50, offset = 0) {
    return this.request(`/transaction?limit=${limit}&offset=${offset}`);
  }

  async getTransactionStats(period = "month") {
    return this.request(`/transaction/stats?period=${period}`);
  }

  // Payment endpoints
  async getPaymentMethods() {
    return this.request("/payment/methods");
  }

  async deposit(amount, paymentMethodId, referenceId) {
    return this.request("/payment/deposit", {
      method: "POST",
      body: JSON.stringify({
        amount,
        payment_method_id: paymentMethodId,
        reference_id: referenceId,
      }),
    });
  }

  async withdraw(amount, cardNumber) {
    return this.request("/payment/withdraw", {
      method: "POST",
      body: JSON.stringify({
        amount,
        card_number: cardNumber,
      }),
    });
  }

  async addPaymentMethod(methodData) {
    return this.request("/payment/add-method", {
      method: "POST",
      body: JSON.stringify(methodData),
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request("/admin/stats");
  }

  async getAdminUsers(page = 1, limit = 20) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async getAdminTrades(page = 1, limit = 20, status = null) {
    const query = status ? `&status=${status}` : "";
    return this.request(`/admin/trades?page=${page}&limit=${limit}${query}`);
  }

  async updateUserStatus(userId, isActive) {
    return this.request(`/admin/user/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async updateTradeStatus(tradeId, status) {
    return this.request(`/admin/trade/${tradeId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return localStorage.getItem("user_role") === "admin";
  }
}

export default new ApiService();
