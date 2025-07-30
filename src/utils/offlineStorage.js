// src/utils/offlineStorage.js - To'liq versiya
export class OfflineStorage {
  static KEYS = {
    USER: "tradelock_user",
    TRADES: "tradelock_trades",
    PAYMENTS: "tradelock_payments",
    SETTINGS: "tradelock_settings",
    AUTH_TOKEN: "tradelock_token",
    LAST_SYNC: "tradelock_last_sync",
  };

  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  }

  static load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return defaultValue;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
      return false;
    }
  }

  static clear() {
    try {
      Object.values(this.KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  }

  static initDefaults() {
    if (!this.load(this.KEYS.USER)) {
      this.save(this.KEYS.USER, defaultUser);
    }
    if (!this.load(this.KEYS.TRADES)) {
      this.save(this.KEYS.TRADES, defaultTrades);
    }
    if (!this.load(this.KEYS.PAYMENTS)) {
      this.save(this.KEYS.PAYMENTS, defaultPayments);
    }
  }

  static getPendingSync() {
    return {
      trades: this.load(this.KEYS.TRADES, []).filter((t) => t.pending_sync),
      payments: this.load(this.KEYS.PAYMENTS, []).filter((p) => p.pending_sync),
      user_updates: this.load("tradelock_pending_user_updates", []),
    };
  }

  static markForSync(type, id) {
    const key = type === "trade" ? this.KEYS.TRADES : this.KEYS.PAYMENTS;
    const items = this.load(key, []);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, pending_sync: true } : item
    );
    this.save(key, updatedItems);
  }
}

// Default User data
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

// Default Trades data
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
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
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
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
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

// Default Payments data
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
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
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
