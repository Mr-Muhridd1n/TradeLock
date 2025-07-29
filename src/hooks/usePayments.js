// src/hooks/usePayments.js
import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const usePayments = () => {
  const { apiCall, isAuthenticated } = useApi();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const paymentsData = await apiCall("payment");
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDeposit = async (amount, paymentMethod, cardNumber) => {
    try {
      const result = await apiCall("payment", {
        method: "POST",
        body: JSON.stringify({
          type: "deposit",
          amount,
          payment_method: paymentMethod,
          card_number: cardNumber,
        }),
      });
      await fetchPayments(); // Refresh payments list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createWithdraw = async (amount, cardNumber) => {
    try {
      const result = await apiCall("payment", {
        method: "POST",
        body: JSON.stringify({
          type: "withdraw",
          amount,
          card_number: cardNumber,
        }),
      });
      await fetchPayments(); // Refresh payments list
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [isAuthenticated]);

  return {
    payments,
    loading,
    error,
    createDeposit,
    createWithdraw,
    refetch: fetchPayments,
  };
};
