const API_BASE_URL = "https://mr-muhridd1n.uz/api";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
    // MUHIM: Mock data ni o'chirish
    // this.useMockData = false; // Production uchun false
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

    console.log("API so'rov:", url); // Debug uchun

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

      console.log("API javob status:", response.status); // Debug uchun

      // 401 Unauthorized
      if (response.status === 401) {
        this.removeToken();
        window.location.href = "/";
        throw new Error("Avtorizatsiya talab qilinadi");
      }

      // Server xatosi
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API xatosi:", response.status, errorText);
        throw new Error(`Server xatosi: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        console.log("API javob:", data); // Debug uchun
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

  // Auth endpoints - BACKEND ga mos keltirilgan
  async authenticateWithTelegram(telegramData) {
    try {
      return await this.request("/auth/telegram", {
        method: "POST",
        body: JSON.stringify(telegramData),
      });
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

  // Trade endpoints - BACKEND endpoint lariga mos
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
      return response.ok;
    } catch (error) {
      console.error("API status check failed:", error);
      return false;
    }
  }
}

export default new ApiService();

// ===========================================

// ===========================================
// 3. BACKEND BILAN ALOQA TEKSHIRUVI

// Console da quyidagi kodlarni ishlatib backend holatini tekshiring:

// Test 1: API mavjudligini tekshirish
/*
fetch('https://mr-muhridd1n.uz/api/health')
  .then(res => res.json())
  .then(data => console.log('API Health:', data))
  .catch(err => console.error('API offline:', err))
*/

// Test 2: Auth endpointni tekshirish
/*
fetch('https://mr-muhridd1n.uz/api/auth/telegram', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    user: {id: 123, first_name: 'Test'},
    hash: 'test_hash'
  })
})
.then(res => res.json())
.then(data => console.log('Auth test:', data))
.catch(err => console.error('Auth error:', err))
*/

// ===========================================
// BACKEND TALAB QILINADIGAN ENDPOINT LAR:

/*
MUHIM: Sizning backend API quyidagi endpoint larni qo'llab-quvvatlashi kerak:

GET  /health                    - API status
POST /auth/telegram            - Telegram orqali login
GET  /user                     - User ma'lumotlari  
GET  /user/balance            - User balansi
GET  /trade/list              - Savdolar ro'yxati
GET  /trade/code/{code}       - Mahfiy kod orqali savdo
POST /trade/create            - Yangi savdo
POST /trade/join              - Savdoga qo'shilish
POST /trade/complete          - Savdoni yakunlash
POST /trade/cancel            - Savdoni bekor qilish
GET  /transaction             - Tranzaksiyalar
POST /payment/deposit         - To'lov qilish

Har bir endpoint JWT token orqali himoyalangan bo'lishi kerak
(Authorization: Bearer {token} header da)
*/
