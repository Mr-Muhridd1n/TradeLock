// src/services/api.js
import { showToast } from "../utils/toast";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-domain.com/api"
    : "/api"; // Proxy orqali development da

class ApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  // Token boshqaruv
  setToken(token) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  }

  // Asosiy request metodi
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

      if (response.success && response.token) {
        this.setToken(response.token);
        // User role ni ham saqlash
        if (response.user && response.user.role === "admin") {
          localStorage.setItem("user_role", "admin");
        }
      }

      return response;
    } catch (error) {
      showToast.error("Autentifikatsiya xatosi");
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
    return this.request(`/trade/by-code/${secretCode}`);
  }

  async createTrade(tradeData) {
    try {
      const response = await this.request("/trade/create", {
        method: "POST",
        body: JSON.stringify(tradeData),
      });

      if (response.success) {
        showToast.success("Savdo muvaffaqiyatli yaratildi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Savdo yaratishda xatolik");
      throw error;
    }
  }

  async joinTrade(secretCode) {
    try {
      const response = await this.request("/trade/join", {
        method: "POST",
        body: JSON.stringify({ secret_code: secretCode }),
      });

      if (response.success) {
        showToast.success("Savdoga muvaffaqiyatli qo'shildingiz");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Savdoga qo'shilishda xatolik");
      throw error;
    }
  }

  async completeTrade(tradeId) {
    try {
      const response = await this.request("/trade/complete", {
        method: "POST",
        body: JSON.stringify({ trade_id: tradeId }),
      });

      if (response.success) {
        showToast.success("Savdo yakunlandi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Savdoni yakunlashda xatolik");
      throw error;
    }
  }

  async cancelTrade(tradeId) {
    try {
      const response = await this.request("/trade/cancel", {
        method: "POST",
        body: JSON.stringify({ trade_id: tradeId }),
      });

      if (response.success) {
        showToast.info("Savdo bekor qilindi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Savdoni bekor qilishda xatolik");
      throw error;
    }
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
    try {
      const response = await this.request("/payment/deposit", {
        method: "POST",
        body: JSON.stringify({
          amount,
          payment_method_id: paymentMethodId,
          reference_id: referenceId,
        }),
      });

      if (response.success) {
        showToast.success("To'lov muvaffaqiyatli amalga oshirildi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "To'lov amalga oshirishda xatolik");
      throw error;
    }
  }

  async withdraw(amount, cardNumber) {
    try {
      const response = await this.request("/payment/withdraw", {
        method: "POST",
        body: JSON.stringify({
          amount,
          card_number: cardNumber,
        }),
      });

      if (response.success) {
        showToast.success("Pul yechish so'rovi yuborildi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Pul yechishda xatolik");
      throw error;
    }
  }

  async addPaymentMethod(methodData) {
    try {
      const response = await this.request("/payment/add-method", {
        method: "POST",
        body: JSON.stringify(methodData),
      });

      if (response.success) {
        showToast.success("To'lov usuli qo'shildi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "To'lov usulini qo'shishda xatolik");
      throw error;
    }
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

  async getAdminTransactions(page = 1, limit = 20) {
    return this.request(`/admin/transactions?page=${page}&limit=${limit}`);
  }

  async updateUserStatus(userId, isActive) {
    try {
      const response = await this.request(`/admin/user/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ is_active: isActive }),
      });

      if (response.success) {
        showToast.success("Foydalanuvchi holati yangilandi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Xatolik yuz berdi");
      throw error;
    }
  }

  async updateTradeStatus(tradeId, status) {
    try {
      const response = await this.request(`/admin/trade/${tradeId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      if (response.success) {
        showToast.success("Savdo holati yangilandi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Xatolik yuz berdi");
      throw error;
    }
  }

  async getSystemSettings() {
    return this.request("/admin/settings");
  }

  async updateSystemSettings(settings) {
    try {
      const response = await this.request("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      if (response.success) {
        showToast.success("Sozlamalar yangilandi");
      }

      return response;
    } catch (error) {
      showToast.error(error.message || "Sozlamalarni yangilashda xatolik");
      throw error;
    }
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
