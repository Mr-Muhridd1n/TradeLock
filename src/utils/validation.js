// src/utils/validation.js
import { formatCurrency } from "./formatters";

export const validateAmount = (amount, min = 1000, max = 10000000) => {
  const cleanAmount =
    typeof amount === "string" ? amount.replace(/\s/g, "") : amount;
  const num = parseFloat(cleanAmount);

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

  // Luhn algoritmi bilan karta raqamini tekshirish
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return "Karta raqami noto'g'ri";
  }

  return null;
};

export const validateTradeName = (name) => {
  if (!name || name.trim().length === 0) {
    return "Savdo nomi bo'sh bo'lishi mumkin emas";
  }

  if (name.trim().length < 3) {
    return "Savdo nomi kamida 3 ta belgidan iborat bo'lishi kerak";
  }

  if (name.length > 50) {
    return "Savdo nomi 50 ta belgidan oshmasligi kerak";
  }

  // Maxsus belgilarni tekshirish
  const allowedChars = /^[a-zA-Zа-яА-Я0-9\s\-_.,!]+$/;
  if (!allowedChars.test(name)) {
    return "Savdo nomida ruxsat etilmagan belgilar mavjud";
  }

  return null;
};

export const validateEmail = (email) => {
  if (!email) return null; // Email majburiy emas

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email formati noto'g'ri";
  }

  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Telefon majburiy emas

  const phoneRegex = /^\+998[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return "Telefon raqami formati: +998XXXXXXXXX";
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
  }

  if (password.length > 50) {
    return "Parol 50 ta belgidan oshmasligi kerak";
  }

  // Kamida bitta raqam va bitta harf bo'lishi kerak
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
    return "Parolda kamida bitta raqam va bitta harf bo'lishi kerak";
  }

  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Parollar mos kelmaydi";
  }

  return null;
};
