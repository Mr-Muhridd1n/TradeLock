import React, { useState } from "react";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import {
  CreditCard,
  Shield,
  ArrowRight,
  Copy,
  Wallet,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export const Chiqarish = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { result, dispatch } = useMainGlobalContext();
  const hide = result.user.setting.balance_hide;

  const minWithdrawal = 10000;
  const maxWithdrawal = 5000000;
  const totalAmount = withdrawalAmount;

  const handleWithdraw = async () => {
    if (!withdrawalAmount || !cardNumber) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setWithdrawalAmount("");
      setCardNumber("");
    }, 10000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mablag' Chiqarish
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Xavfsizlik</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-6 h-6 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Balans
                  </h2>
                </div>
                <button
                  onClick={() =>
                    dispatch({
                      type: "SETHIDE",
                      payload: !hide,
                    })
                  }
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  {!hide ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {hide ? "••• ••• so'm" : formatCurrency(result.balance)}
                </div>
                <div className="text-sm text-gray-500">Mavjud balans</div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Minimal chiqarish:</span>
                  <span className="font-medium text-black/50">
                    {formatCurrency(minWithdrawal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Maksimal chiqarish:</span>
                  <span className="font-medium text-black/50">
                    {formatCurrency(maxWithdrawal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-20">
              {showSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Muvaffaqiyatli!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Chiqarish so'rovi muvaffaqiyatli yuborildi
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-green-700">
                      {formatCurrency(parseFloat(withdrawalAmount))} - 1-3 ish
                      kuni ichida kartangizga o'tkaziladi
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chiqarish summasi
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        placeholder="Summani kiriting"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
                        min={minWithdrawal}
                        max={maxWithdrawal}
                      />
                      <div className="absolute right-3 top-3 text-gray-500">
                        so'm
                      </div>
                    </div>
                    {withdrawalAmount && (
                      <div className="mt-2 text-sm text-gray-600">
                        {parseFloat(withdrawalAmount) < minWithdrawal && (
                          <div className="flex items-center space-x-1 text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              Minimal summa: {formatCurrency(minWithdrawal)}
                            </span>
                          </div>
                        )}
                        {parseFloat(withdrawalAmount) > maxWithdrawal && (
                          <div className="flex items-center space-x-1 text-red-500">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                              Maksimal summa: {formatCurrency(maxWithdrawal)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Number Input */}
                  {withdrawalAmount >= minWithdrawal &&
                    withdrawalAmount <= maxWithdrawal && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Karta raqami
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, "");
                              const formatted = value
                                .replace(/(.{4})/g, "$1 ")
                                .trim();
                              setCardNumber(formatted);
                            }}
                            placeholder="8600 0000 0000 0000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-500"
                            maxLength={19}
                          />
                          <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Summary */}
                  {withdrawalAmount && (
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-blue-500">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Chiqarish summasi:
                        </span>
                        <span className="font-medium ">
                          {formatCurrency(parseFloat(withdrawalAmount))}
                        </span>
                      </div>
                      <div className="border-t pt-2 border-gray-500">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-500">Jami to'lov:</span>
                          <span>{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={
                      !withdrawalAmount ||
                      !cardNumber ||
                      parseFloat(withdrawalAmount) < minWithdrawal ||
                      parseFloat(withdrawalAmount) > maxWithdrawal ||
                      totalAmount > result.balance ||
                      isProcessing
                    }
                    className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                      !withdrawalAmount ||
                      !cardNumber ||
                      parseFloat(withdrawalAmount) < minWithdrawal ||
                      parseFloat(withdrawalAmount) > maxWithdrawal ||
                      totalAmount > result.balance ||
                      isProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Chiqarish</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <div className="font-medium mb-1">
                          Xavfsizlik eslatmasi
                        </div>
                        <div>
                          Barcha tranzaksiyalar xavfsiz SSL shifrlash bilan
                          himoyalangan. Mablag' 1-3 ish kuni ichida o'tkaziladi.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
