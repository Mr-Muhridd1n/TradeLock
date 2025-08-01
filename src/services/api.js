// src/services/api.js - To'liq tuzatilgan versiya

const API_BASE_URL = "https://mr-muhridd1n.uz/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
    if (this.token) {
      console.log(
        "Token localStorage dan o'qildi:",
        this.token.substring(0, 20) + "..."
      );
    } else {
      console.log("LocalStorage da token topilmadi");
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("auth_token", token);
    console.log("Token saqlandi:", token.substring(0, 20) + "...");
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    console.log("Token o'chirildi");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("API so'rov:", url);

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Token ni qo'shish
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
      console.log(
        "Authorization header qo'shildi:",
        `Bearer ${this.token.substring(0, 20)}...`
      );
    } else {
      console.log("Token topilmadi");
    }

    try {
      const response = await fetch(url, config);

      console.log("API javob status:", response.status);

      // 401 Unauthorized
      if (response.status === 401) {
        console.error("401 Unauthorized - token muammosi");
        this.removeToken();

        // Agar auth endpoint bo'lmasa, error throw qilish
        if (!endpoint.includes("/auth/")) {
          throw new Error("Avtorizatsiya talab qilinadi");
        }
      }

      // Server xatosi
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API xatosi:", response.status, errorText);
        throw new Error(`Server xatosi: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log("API javob:", data);
        return data;
      } else {
        const text = await response.text();
        console.log("API matn javob:", text);
        return { message: text };
      }
    } catch (error) {
      console.error("API So'rov xatosi:", error);

      // Network xatosi
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Internet aloqasi bilan muammo. Iltimos, internetni tekshiring."
        );
      }

      throw error;
    }
  }

  // Token validate qilish method
  async validateToken() {
    if (!this.token) {
      return false;
    }

    try {
      await this.getUser();
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      this.removeToken();
      return false;
    }
  }

  // Auth endpoints
  async authenticateWithTelegram(telegramData) {
    try {
      const response = await this.request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify(telegramData),
      });

      if (response && response.success && response.token) {
        this.setToken(response.token);
        console.log("Authentication successful");
        return response;
      } else {
        throw new Error(response?.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth xatosi:", error);
      throw new Error("Tizimga kirishda xatolik: " + error.message);
    }
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
    let endpoint = "/trade/list";
    if (status) {
      endpoint += `?status=${status}`;
    }
    return this.request(endpoint);
  }

  async getTradeById(id) {
    return this.request(`/trade/${id}`);
  }

  async getTradeBySecretCode(secretCode) {
    return this.request(`/trade/code/${secretCode}`);
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

  // Admin endpoints
  async getAdminStats() {
    return this.request("/admin/stats");
  }

  async getAdminUsers(page = 1, limit = 20) {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async getAdminTrades(page = 1, limit = 20, status = null) {
    let endpoint = `/admin/trades?page=${page}&limit=${limit}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request(endpoint);
  }

  async updateUserStatus(userId, isActive) {
    return this.request("/admin/user/status", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        is_active: isActive,
      }),
    });
  }

  async updateTradeStatus(tradeId, status) {
    return this.request("/admin/trade/status", {
      method: "POST",
      body: JSON.stringify({
        trade_id: tradeId,
        status: status,
      }),
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return localStorage.getItem("user_role") === "admin";
  }

  // API status tekshirish
  async checkApiStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("API Health check:", data);
      return response.ok;
    } catch (error) {
      console.error("API status check failed:", error);
      return false;
    }
  }

  // Debug methods
  async debugAuth() {
    console.log("=== AUTH DEBUG INFO ===");
    console.log(
      "Current token:",
      this.token ? this.token.substring(0, 30) + "..." : "None"
    );
    console.log(
      "LocalStorage token:",
      localStorage.getItem("auth_token")
        ? localStorage.getItem("auth_token").substring(0, 30) + "..."
        : "None"
    );
    console.log("User role:", localStorage.getItem("user_role"));

    if (this.token) {
      try {
        const user = await this.getUser();
        console.log("Token is valid, user:", user);
        return true;
      } catch (error) {
        console.log("Token is invalid:", error.message);
        return false;
      }
    } else {
      console.log("No token available");
      return false;
    }
  }

  // Logout method
  logout() {
    this.removeToken();
    console.log("User logged out");
  }
}

export default new ApiService();

// ===========================================
// DEBUGGING HELPERS
// ===========================================

// Browser console da ishlatish uchun
if (typeof window !== "undefined") {
  window.apiDebug = {
    // Token ni tekshirish
    checkToken: async () => {
      const api = (await import("./api.js")).default;
      return await api.debugAuth();
    },

    // API holatini tekshirish
    checkHealth: async () => {
      const api = (await import("./api.js")).default;
      return await api.checkApiStatus();
    },

    // To'liq test
    fullTest: async () => {
      console.log("🚀 Starting full API test...");

      const api = (await import("./api.js")).default;

      // 1. Health check
      console.log("1. Health check...");
      const health = await api.checkApiStatus();
      console.log("Health:", health);

      // 2. Auth check
      console.log("2. Auth check...");
      const authValid = await api.debugAuth();
      console.log("Auth valid:", authValid);

      if (authValid) {
        // 3. User data
        console.log("3. Getting user data...");
        try {
          const user = await api.getUser();
          console.log("User data:", user);
        } catch (error) {
          console.error("User data error:", error);
        }

        // 4. Balance
        console.log("4. Getting balance...");
        try {
          const balance = await api.getUserBalance();
          console.log("Balance:", balance);
        } catch (error) {
          console.error("Balance error:", error);
        }

        // 5. Trades
        console.log("5. Getting trades...");
        try {
          const trades = await api.getTrades();
          console.log("Trades:", trades);
        } catch (error) {
          console.error("Trades error:", error);
        }
      }

      console.log("✅ Full test completed!");
    },
  };

  // Global access
  window.api = (async () => (await import("./api.js")).default)();
}

// ===========================================
// EXAMPLE USAGE
// ===========================================

/*
// Authentication
const authData = {
  user: {
    id: 123456789,
    first_name: "Test User",
    username: "testuser"
  },
  hash: "demo_hash"
};

api.authenticateWithTelegram(authData)
  .then(result => console.log("Auth result:", result))
  .catch(error => console.error("Auth error:", error));

// Get user data
api.getUser()
  .then(user => console.log("User:", user))
  .catch(error => console.error("User error:", error));

// Create trade
const tradeData = {
  trade_name: "Test Trade",
  amount: 10000,
  creator_role: "seller",
  commission_type: "creator"
};

api.createTrade(tradeData)
  .then(result => console.log("Trade created:", result))
  .catch(error => console.error("Trade error:", error));
*/
