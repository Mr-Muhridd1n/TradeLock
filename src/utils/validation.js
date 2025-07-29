// src/utils/validation.js
export const validateAmount = (amount, min = 1000, max = 10000000) => {
  const num = parseFloat(amount);

  if (isNaN(num) || num <= 0) {
    return "Summa noto'g'ri kiritilgan";
  }

  if (num < min) {
    return `Minimal summa ${formatCurrency(min)}`;
  }

  if (num > max) {
    return `Maksimal summa ${formatCurrency(max)}`;
  }

  return null;
};

export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s+/g, "");

  if (cleaned.length < 16) {
    return "Karta raqami to'liq emas";
  }

  if (!/^\d+$/.test(cleaned)) {
    return "Karta raqamida faqat raqamlar bo'lishi kerak";
  }

  return null;
};

export const validateTradeName = (name) => {
  if (!name || name.trim().length === 0) {
    return "Savdo nomi bo'sh bo'lishi mumkin emas";
  }

  if (name.length < 3) {
    return "Savdo nomi kamida 3 ta belgidan iborat bo'lishi kerak";
  }

  if (name.length > 50) {
    return "Savdo nomi 50 ta belgidan oshmasligi kerak";
  }

  return null;
};
