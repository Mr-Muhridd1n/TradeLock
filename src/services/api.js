// src/services/api.js
const API_BASE_URL = "https://mr-muhridd1n.uz/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  }

  async request(endpoint, options = {}) {
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
    try {
      const response = await this.request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify(telegramData),
      });

      if (response.success) {
        this.setToken(response.token);
        if (response.user?.role === "admin") {
          localStorage.setItem("user_role", "admin");
        }
      }

      return response;
    } catch (error) {
      throw error;
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
    const query = status ? `?status=${status}` : "";
    return this.request(`/trade/list${query}`);
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
