// src/services/api.js - Development mode va xavfsizlik bilan optimallashtirilgan

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://mr-muhridd1n.uz/api";
const DEVELOPMENT_MODE =
  import.meta.env.DEV || window.location.hostname === "localhost";

class ApiService {
  constructor() {
    this.token = this.getStoredToken();
    this.isDevelopment = DEVELOPMENT_MODE;

    if (this.token) {
      console.log(
        "Token localStorage dan o'qildi:",
        this.token.substring(0, 20) + "..."
      );
    } else {
      console.log("LocalStorage da token topilmadi");
    }

    if (this.isDevelopment) {
      console.log("🔧 Development mode faol");
    }
  }

  getStoredToken() {
    try {
      return localStorage.getItem("auth_token");
    } catch (error) {
      console.error("Token localStorage dan o'qishda xatolik:", error);
      return null;
    }
  }

  setToken(token) {
    try {
      this.token = token;
      localStorage.setItem("auth_token", token);
      console.log("Token saqlandi:", token.substring(0, 20) + "...");
    } catch (error) {
      console.error("Token saqlashda xatolik:", error);
    }
  }

  removeToken() {
    try {
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");
      console.log("Token o'chirildi");
    } catch (error) {
      console.error("Token o'chirishda xatolik:", error);
    }
  }

  async request(endpoint, options = {}) {
    // Development mode da API server bilan aloqa bo'lmasa, demo data qaytarish
    if (this.isDevelopment) {
      const isOnline = await this.checkApiStatus();
      if (!isOnline && !endpoint.includes("/health")) {
        console.log(
          "🔧 Development mode: API offline, demo data qaytarilmoqda"
        );
        return this.getDemoResponse(endpoint, options);
      }
    }

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
      console.log("Authorization header qo'shildi");
    }

    try {
      const response = await fetch(url, config);
      console.log("API javob status:", response.status);

      // 401 Unauthorized
      if (response.status === 401) {
        console.error("401 Unauthorized - token muammosi");
        this.removeToken();

        if (!endpoint.includes("/auth/")) {
          throw new Error("Avtorizatsiya talab qilinadi");
        }
      }

      // Server xatosi
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API xatosi:", response.status, errorText);

        // Development mode da ba'zi xatolarda demo data qaytarish
        if (
          this.isDevelopment &&
          this.shouldReturnDemoOnError(endpoint, response.status)
        ) {
          console.log(
            "🔧 Development mode: Server xatosi, demo data qaytarilmoqda"
          );
          return this.getDemoResponse(endpoint, options);
        }

        throw new Error(`Server xatosi: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log("API javob muvaffaqiyatli");
        return data;
      } else {
        const text = await response.text();
        return { message: text };
      }
    } catch (error) {
      console.error("API So'rov xatosi:", error);

      // Development mode da network xatolarda demo data
      if (this.isDevelopment && this.isNetworkError(error)) {
        console.log(
          "🔧 Development mode: Network xatosi, demo data qaytarilmoqda"
        );
        return this.getDemoResponse(endpoint, options);
      }

      // Network xatosi
      if (this.isNetworkError(error)) {
        throw new Error(
          "Internet aloqasi bilan muammo. Iltimos, internetni tekshiring."
        );
      }

      throw error;
    }
  }

  isNetworkError(error) {
    return (
      error.name === "TypeError" ||
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    );
  }

  shouldReturnDemoOnError(endpoint, status) {
    // Development mode da 500+ xatolarda demo data qaytarish
    return (
      status >= 500 &&
      (endpoint.includes("/user") ||
        endpoint.includes("/trade") ||
        endpoint.includes("/transaction") ||
        endpoint.includes("/balance"))
    );
  }

  getDemoResponse(endpoint, options) {
    const method = options.method || "GET";

    // Auth endpoints
    if (endpoint.includes("/auth/telegram")) {
      return {
        success: true,
        token: "demo_token_" + Date.now(),
        user: {
          id: 1,
          telegram_id: 123456789,
          first_name: "Demo",
          last_name: "User",
          username: "demo_user",
        },
      };
    }

    // User endpoints
    if (endpoint.includes("/user/balance")) {
      return {
        balance: 100000000,
        frozen_balance: 5000000,
        available_balance: 95000000,
      };
    }

    if (endpoint.includes("/user") && method === "GET") {
      return {
        id: 1,
        telegram_id: 123456789,
        first_name: "Demo",
        last_name: "User",
        username: "demo_user",
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    // Trade endpoints
    if (
      endpoint.includes("/trade/list") ||
      (endpoint.includes("/trade") && method === "GET")
    ) {
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
        {
          id: 2,
          secret_code: "TL456DEMO",
          trade_name: "Yakunlangan Demo",
          amount: 50000,
          commission_amount: 1000,
          commission_type: "split",
          creator_role: "buyer",
          status: "completed",
          partner_id: 2,
          partner_name: "@demo_partner",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }

    if (endpoint.includes("/trade/create")) {
      return {
        success: true,
        trade_id: Math.floor(Math.random() * 1000),
        secret_code:
          "TL" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
    }

    if (
      endpoint.includes("/trade/join") ||
      endpoint.includes("/trade/complete") ||
      endpoint.includes("/trade/cancel")
    ) {
      return { success: true };
    }

    if (endpoint.includes("/trade/code/")) {
      const code = endpoint.split("/").pop();
      return {
        id: 1,
        secret_code: code,
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

    // Transaction endpoints
    if (endpoint.includes("/transaction")) {
      return [
        {
          id: 1,
          type: "deposit",
          amount: 50000,
          created_at: new Date().toISOString(),
          description: "Demo to'lov",
        },
        {
          id: 2,
          type: "trade_release",
          amount: -25000,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          description: "Demo savdo",
        },
      ];
    }

    // Payment endpoints
    if (endpoint.includes("/payment")) {
      return { success: true };
    }

    // Default response
    return { success: true, message: "Demo javob" };
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
        console.log("Authentication muvaffaqiyatli");
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
    try {
      return localStorage.getItem("user_role") === "admin";
    } catch (error) {
      return false;
    }
  }

  // API status tekshirish
  async checkApiStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 soniya timeout

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log("API Health check: OK");
        return true;
      } else {
        console.log("API Health check: Failed", response.status);
        return false;
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("API Health check: Timeout");
      } else {
        console.log("API Health check: Error", error.message);
      }
      return false;
    }
  }

  // Token validate qilish
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

  // Logout method
  logout() {
    this.removeToken();
    console.log("Foydalanuvchi chiqdi");
  }

  // Debug method
  async debugAuth() {
    console.log("=== AUTH DEBUG INFO ===");
    console.log("Development mode:", this.isDevelopment);
    console.log(
      "Current token:",
      this.token ? this.token.substring(0, 30) + "..." : "None"
    );
    console.log("User role:", localStorage.getItem("user_role"));

    if (this.token) {
      try {
        const user = await this.getUser();
        console.log("Token yaroqli, user:", user.first_name);
        return true;
      } catch (error) {
        console.log("Token yaroqsiz:", error.message);
        return false;
      }
    } else {
      console.log("Token mavjud emas");
      return false;
    }
  }
}

export default new ApiService();

// Development mode da browser console uchun debug tools
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  window.apiDebug = {
    checkToken: async () => {
      const api = (await import("./api.js")).default;
      return await api.debugAuth();
    },
    checkHealth: async () => {
      const api = (await import("./api.js")).default;
      return await api.checkApiStatus();
    },
    toggleDemoMode: () => {
      console.log("Demo mode o'chirildi/yoqildi (sahifani yangilang)");
    },
  };
}
