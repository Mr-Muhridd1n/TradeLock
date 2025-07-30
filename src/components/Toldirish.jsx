// src/components/Toldirish.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  formatCurrency,
  validateAmount,
  validateCardNumber,
} from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import { ArrowLeft, CreditCard, Wallet, AlertTriangle } from "lucide-react";

export const Toldirish = () => {
  const navigate = useNavigate();
  const { payments, user, handleError, showSuccess } = useAppContext();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("humo");
  const [cardNumber, setCardNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const minAmount = 10000;
  const maxAmount = 5000000;

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
      // Validatsiya
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

      await payments.createDeposit(
        parseFloat(amount),
        paymentMethod,
        cardNumber.replace(/\s/g, "")
      );

      showSuccess("To'lov so'rovi muvaffaqiyatli yuborildi!");
      hapticFeedback("success");
      navigate("/hamyon");
    } catch (error) {
      handleError(error);
      hapticFeedback("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const isValid = amount && cardNumber && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/hamyon")}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Hisob To'ldirish</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Joriy balans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(user.user?.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            To'ldirish summasi
          </h3>
          <div className="mb-4">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Summani kiriting"
              className="w-full p-4 border border-gray-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {amount && (
              <p className="text-sm text-blue-600 mt-2">
                {formatCurrency(parseFloat(amount) || 0)}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <p>Minimal: {formatCurrency(minAmount)}</p>
            <p>Maksimal: {formatCurrency(maxAmount)}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">To'lov usuli</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "humo", label: "Humo", color: "bg-red-500" },
              { key: "uzcard", label: "UzCard", color: "bg-blue-500" },
              { key: "visa", label: "Visa", color: "bg-indigo-500" },
              {
                key: "mastercard",
                label: "MasterCard",
                color: "bg-orange-500",
              },
            ].map((method) => (
              <button
                key={method.key}
                onClick={() => {
                  setPaymentMethod(method.key);
                  hapticFeedback("selection");
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === method.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 ${method.color} rounded flex items-center justify-center`}
                  >
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">
                    {method.label}
                  </span>
                </div>
              </button>
            ))}
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
            className="w-full p-4 border border-gray-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                Xavfsizlik eslatmasi
              </h4>
              <p className="text-sm text-yellow-700">
                Karta ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga
                uzatilmaydi.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pb-6">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all transform active:scale-95"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Qayta ishlanmoqda...
              </div>
            ) : (
              "To'ldirish"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
