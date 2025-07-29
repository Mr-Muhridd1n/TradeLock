// src/utils/formatters.js
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0";
  return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} kun oldin`;
  } else if (hours > 0) {
    return `${hours} soat oldin`;
  } else if (minutes > 0) {
    return `${minutes} daqiqa oldin`;
  } else {
    return "Hozir";
  }
};

export const getTradeStatusText = (status) => {
  const statusMap = {
    active: "Faol",
    in_progress: "Jarayonda",
    completed: "Yakunlangan",
    cancelled: "Bekor qilingan",
  };

  return statusMap[status] || status;
};

export const getPaymentStatusText = (status) => {
  const statusMap = {
    pending: "Kutilmoqda",
    completed: "Yakunlangan",
    failed: "Muvaffaqiyatsiz",
    cancelled: "Bekor qilingan",
  };

  return statusMap[status] || status;
};

export const generateShareableTradeLink = (secretLink) => {
  return `https://t.me/${BOT_USERNAME}?start=trade_${secretLink}`;
};
