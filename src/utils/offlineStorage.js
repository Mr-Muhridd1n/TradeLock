// src/utils/offlineStorage.js - Offline rejimi uchun
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

  // Default ma'lumotlarni yuklash
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

  // Sinxronizatsiya uchun ma'lumotlarni olish
  static getPendingSync() {
    return {
      trades: this.load(this.KEYS.TRADES, []).filter((t) => t.pending_sync),
      payments: this.load(this.KEYS.PAYMENTS, []).filter((p) => p.pending_sync),
      user_updates: this.load("tradelock_pending_user_updates", []),
    };
  }

  // Sinxronizatsiya keyingi ma'lumotlarni belgilash
  static markForSync(type, id) {
    const key = type === "trade" ? this.KEYS.TRADES : this.KEYS.PAYMENTS;
    const items = this.load(key, []);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, pending_sync: true } : item
    );
    this.save(key, updatedItems);
  }
}
