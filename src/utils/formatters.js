// src/utils/formatters.js
export {
  validateAmount,
  validateTradeName,
  validateCardNumber,
  validateEmail,
  validatePhone,
} from "./validation";

// Bot username konstanta
export const BOT_USERNAME = "Trade_Lock_bot";

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0";
  return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
};

export const formatNumber = (number) => {
  const numStr = String(number || 0);
  if (!numStr || numStr === "0") return "0";
  return numStr.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    // Eski format uchun: "2025.07.07 05:12"
    const formattedDate = dateString.replace(
      /(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/,
      "$1-$2-$3T$4:$5:00"
    );
    const newDate = new Date(formattedDate);
    if (!isNaN(newDate.getTime())) {
      return new Intl.DateTimeFormat("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(newDate);
    }
    return dateString;
  }

  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getTimeAgo = (dateString) => {
  let date;

  if (typeof dateString === "string" && dateString.includes(".")) {
    // Eski format: "2025.07.07 05:12"
    const formattedDate = dateString.replace(
      /(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})/,
      "$1-$2-$3T$4:$5:00+05:00"
    );
    date = new Date(formattedDate);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return "Noma'lum vaqt";
  }

  const now = new Date();
  const diffInMs = now - date;

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} oy oldin`;
  } else if (weeks > 0) {
    return `${weeks} hafta oldin`;
  } else if (days > 0) {
    return `${days} kun oldin`;
  } else if (hours > 0) {
    return `${hours} soat oldin`;
  } else if (minutes > 0) {
    return `${minutes} daqiqa oldin`;
  } else if (seconds > 5) {
    return `${seconds} soniya oldin`;
  } else {
    return "Hozir";
  }
};

export const getTradeStatusText = (status) => {
  const statusMap = {
    active: "Faol",
    in_progress: "Jarayonda",
    waiting: "Kutilmoqda",
    completed: "Yakunlangan",
    cancelled: "Bekor qilingan",
    expired: "Muddati tugagan",
    pending: "Kutilmoqda",
    processing: "Qayta ishlanmoqda",
  };

  return statusMap[status] || status;
};

export const getPaymentStatusText = (status) => {
  const statusMap = {
    pending: "Kutilmoqda",
    processing: "Qayta ishlanmoqda",
    completed: "Yakunlangan",
    failed: "Muvaffaqiyatsiz",
    cancelled: "Bekor qilingan",
    expired: "Muddati tugagan",
    rejected: "Rad etilgan",
  };

  return statusMap[status] || status;
};

export const getPaymentTypeText = (type) => {
  const typeMap = {
    deposit: "Hisob to'ldirish",
    withdraw: "Mablag' chiqarish",
    trade_earn: "Savdodan daromad",
    trade_pay: "Savdo to'lovi",
    commission: "Komissiya",
    transfer: "O'tkazma",
    refund: "Qaytarish",
    bonus: "Bonus",
    penalty: "Jarima",
  };

  return typeMap[type] || type;
};

export const generateShareableTradeLink = (secretLink) => {
  return `https://t.me/${BOT_USERNAME}?start=trade_${secretLink}`;
};

export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return "";

  const cleaned = cardNumber.replace(/\s/g, "");
  const match = cleaned.match(/(\d{4})(\d{4})(\d{4})(\d{4})/);

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }

  return cleaned.replace(/(.{4})/g, "$1 ").trim();
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return "";

  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length >= 16) {
    return `${cleaned.substring(0, 4)} **** **** ${cleaned.substring(12)}`;
  }

  return cardNumber;
};

export const getCardType = (cardNumber) => {
  if (!cardNumber) return "unknown";

  const cleaned = cardNumber.replace(/\s/g, "");

  if (cleaned.startsWith("4")) return "visa";
  if (cleaned.startsWith("5")) return "mastercard";
  if (cleaned.startsWith("9860")) return "humo";
  if (cleaned.startsWith("8600")) return "uzcard";

  return "unknown";
};

export const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TL${timestamp}${random}`.toUpperCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPercentage = (value, decimals = 1) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};
