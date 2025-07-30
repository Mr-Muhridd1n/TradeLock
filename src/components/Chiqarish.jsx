// src/components/Chiqarish.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  formatCurrency,
  validateAmount,
  validateCardNumber,
} from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import { ArrowLeft, Wallet, AlertTriangle, TrendingDown } from "lucide-react";

export const Chiqarish = () => {
  const navigate = useNavigate();
  const { payments, user, handleError, showSuccess } = useAppContext();
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const minAmount = 10000;
  const maxAmount = user.user?.balance || 0;
  const commissionRate = 2; // 2%

  const handleAmountChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setAmount(cleanValue);
  };

  const handleCardNumberChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const formattedValue = cleanValue.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  const handleSubmit = async () => {
    try {
      const amountError = validateAmount(amount, minAmount, maxAmount);
      if (amountError) {
        handleError(new Error(amountError));
        return;
      }

      const cardError = validateCardNumber(cardNumber);
      if (cardError) {
        handleError(new Error(cardError));
        return;
      }

      setIsProcessing(true);
      hapticFeedback("medium");

      await payments.createWithdraw(
        parseFloat(amount),
        cardNumber.replace(/\s/g, "")
      );

      showSuccess("Chiqarish so'rovi muvaffaqiyatli yuborildi!");
      hapticFeedback("success");
      navigate("/hamyon");
    } catch (error) {
      handleError(error);
      hapticFeedback("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const commission = amount ? (parseFloat(amount) * commissionRate) / 100 : 0;
  const totalReceive = amount ? parseFloat(amount) - commission : 0;
  const isValid =
    amount && cardNumber && !isProcessing && parseFloat(amount) <= maxAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/hamyon")}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Mablag' Chiqarish</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Mavjud balans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(maxAmount)}
                </p>
              </div>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Chiqarish summasi
          </h3>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Summani kiriting"
            className="w-full p-4 border border-gray-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
          />

          {amount && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Chiqarilayotgan summa:</span>
                <span className="font-semibold">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Komissiya ({commissionRate}%):
                </span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(commission)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Oladigan summa:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalReceive)}
                </span>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 mt-4">
            <p>Minimal: {formatCurrency(minAmount)}</p>
            <p>Maksimal: {formatCurrency(maxAmount)}</p>
          </div>
        </div>

        {/* Card Number */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Karta raqami</h3>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full p-4 border border-gray-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            Mablag' ushbu karta raqamiga o'tkaziladi
          </p>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">
                Muhim ma'lumot
              </h4>
              <p className="text-sm text-orange-700">
                Mablag' chiqarish 1-3 ish kuni ichida amalga oshiriladi.
                Komissiya miqdori {commissionRate}% ni tashkil qiladi.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pb-6">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all transform active:scale-95"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Qayta ishlanmoqda...
              </div>
            ) : (
              `${formatCurrency(totalReceive)} chiqarish`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
