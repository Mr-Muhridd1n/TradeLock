// src/hooks/usePayments.js - Yangilangan versiya
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { OfflineStorage, defaultPayments } from "../utils/offlineStorage";

export const usePayments = () => {
  const { apiCall, isAuthenticated, isOfflineMode } = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      let paymentsData;
      if (isOfflineMode) {
        // Offline rejimda localStorage dan olish
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);
        const allPayments = OfflineStorage.load(
          OfflineStorage.KEYS.PAYMENTS,
          defaultPayments
        );
        paymentsData = allPayments.filter(
          (payment) => payment.user_id === currentUser.id
        );
        console.log("📱 Loading payments from offline storage");
      } else {
        // Online rejimda API dan olish
        paymentsData = await apiCall("payment");
        // Ma'lumotlarni localStorage ga saqlash
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, paymentsData);
      }

      setPayments(paymentsData);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError(err.message);

      // Xato bo'lsa, offline ma'lumotlarni ishlatishga harakat qilish
      const cachedPayments = OfflineStorage.load(OfflineStorage.KEYS.PAYMENTS);
      if (cachedPayments) {
        console.log("📱 Using cached payments after API error");
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);
        const filteredPayments = cachedPayments.filter(
          (payment) => payment.user_id === currentUser.id
        );
        setPayments(filteredPayments);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const createDeposit = async (amount, paymentMethod, cardNumber) => {
    try {
      setError(null);

      let result;
      if (isOfflineMode) {
        // Offline rejimda localStorage ga saqlash
        const currentPayments = OfflineStorage.load(
          OfflineStorage.KEYS.PAYMENTS,
          defaultPayments
        );
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);

        const newPayment = {
          id: Date.now(),
          user_id: currentUser.id,
          type: "deposit",
          amount: amount,
          status: "pending",
          payment_method: paymentMethod,
          card_number: `${cardNumber.slice(0, 4)}****${cardNumber.slice(-4)}`,
          reference: generateReference("DEP"),
          description: "Hisob to'ldirish",
          created_at: new Date().toISOString(),
          pending_sync: true,
        };

        const updatedPayments = [newPayment, ...currentPayments];
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);

        // Simulate processing after 2 seconds
        setTimeout(() => {
          newPayment.status = "completed";
          newPayment.completed_at = new Date().toISOString();

          // Update user balance
          currentUser.balance += amount;
          OfflineStorage.save(OfflineStorage.KEYS.USER, currentUser);
          OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);

          // Refresh payments list
          fetchPayments();
        }, 2000);

        result = newPayment;
        console.log("📱 Created deposit offline");
      } else {
        // Online rejimda API ga yuborish
        result = await apiCall("payment", {
          method: "POST",
          body: JSON.stringify({
            type: "deposit",
            amount,
            payment_method: paymentMethod,
            card_number: cardNumber,
          }),
        });

        // localStorage ni yangilash
        const currentPayments = OfflineStorage.load(
          OfflineStorage.KEYS.PAYMENTS,
          []
        );
        const updatedPayments = [result, ...currentPayments];
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);
      }

      await fetchPayments(); // Ro'yxatni yangilash
      return result;
    } catch (err) {
      console.error("Failed to create deposit:", err);
      setError(err.message);
      throw err;
    }
  };

  const createWithdraw = async (amount, cardNumber) => {
    try {
      setError(null);

      let result;
      if (isOfflineMode) {
        // Offline rejimda localStorage ga saqlash
        const currentPayments = OfflineStorage.load(
          OfflineStorage.KEYS.PAYMENTS,
          defaultPayments
        );
        const currentUser = OfflineStorage.load(OfflineStorage.KEYS.USER);

        // Check balance
        if (currentUser.balance < amount) {
          throw new Error("Yetarli balans yo'q");
        }

        const newPayment = {
          id: Date.now(),
          user_id: currentUser.id,
          type: "withdraw",
          amount: amount,
          status: "pending",
          card_number: `${cardNumber.slice(0, 4)}****${cardNumber.slice(-4)}`,
          reference: generateReference("WTH"),
          description: "Mablag' chiqarish",
          created_at: new Date().toISOString(),
          pending_sync: true,
        };

        const updatedPayments = [newPayment, ...currentPayments];
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);

        // Update user balance immediately
        currentUser.balance -= amount;
        OfflineStorage.save(OfflineStorage.KEYS.USER, currentUser);

        result = newPayment;
        console.log("📱 Created withdraw offline");
      } else {
        // Online rejimda API ga yuborish
        result = await apiCall("payment", {
          method: "POST",
          body: JSON.stringify({
            type: "withdraw",
            amount,
            card_number: cardNumber,
          }),
        });

        // localStorage ni yangilash
        const currentPayments = OfflineStorage.load(
          OfflineStorage.KEYS.PAYMENTS,
          []
        );
        const updatedPayments = [result, ...currentPayments];
        OfflineStorage.save(OfflineStorage.KEYS.PAYMENTS, updatedPayments);
      }

      await fetchPayments(); // Ro'yxatni yangilash
      return result;
    } catch (err) {
      console.error("Failed to create withdraw:", err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [isAuthenticated, isOfflineMode]);

  return {
    payments,
    loading,
    error,
    createDeposit,
    createWithdraw,
    refetch: fetchPayments,
  };
};

// Helper function
const generateReference = (prefix) => {
  const number = String(Date.now()).slice(-6);
  return `${prefix}${number}`;
};
