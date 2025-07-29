import React, { useState } from "react";
import {
  CreditCard,
  Shield,
  ArrowRight,
  Check,
  Star,
  X,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { FormatNumber } from "../components/FormatNumber";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";

export const Toldirish = () => {
  const { result, dispatch } = useMainGlobalContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [amount, setAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const handlePayment = async () => {
    if (!selectedBank || !amount) return;

    setShowWarning(true);
  };

  const generateCardNumber = () => {
    const prefix =
      selectedBank.name === "Humo"
        ? "9860"
        : selectedBank.name === "Uzcard"
        ? "8600"
        : selectedBank.name === "Visa"
        ? "4"
        : "5";
    const numbers = Math.random().toString().substring(2, 14);
    return prefix + numbers.substring(0, 12 - prefix.length);
  };

  const generateExpiryDate = () => {
    const now = new Date();
    const futureMonth = now.getMonth() + Math.floor(Math.random() * 12) + 1;
    const futureYear = now.getFullYear() + Math.floor(futureMonth / 12);
    return `${((futureMonth % 12) + 1).toString().padStart(2, "0")}/${futureYear
      .toString()
      .substring(2)}`;
  };

  const generateTransactionId = () => {
    return (
      "TXN" +
      Date.now().toString().substring(-8) +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  };

  const proceedWithPayment = () => {
    setShowWarning(false);
    setIsProcessing(true);
    dispatch({
      type: "PAYMENTS",
      payload: { amount: amount, selectedBank: selectedBank.name, time: 10 },
    });
    // Generate payment details
    const details = {
      cardNumber: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      amount: amount,
      bank: selectedBank.name,
      transactionId: generateTransactionId(),
      timeLimit: 10, // 10 minutes
    };

    setPaymentDetails(details);
    setShowPaymentModal(true);
    setIsProcessing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setPaymentDetails(null);
    setAmount("");
    setSelectedBank(null);
    alert("To'lov muvaffaqiyatli amalga oshirildi!");
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setPaymentDetails(null);
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mb-25">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Toldirish
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Xavfsiz to'lov</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Payment Amount Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Hisobni to'ldirish
              </h2>
              <p className="text-gray-600">
                Xavfsiz va tezkor to'lov tizimi orqali hisobingizni to'ldiring
              </p>
            </div>

            {/* Amount Input */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Qancha to'lov qilmoqchisiz?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(FormatNumber(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-2xl font-bold text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white transition-all duration-300 outline-none"
                  placeholder="100 000"
                  maxLength="12"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-500">
                  UZS
                </div>
              </div>
              {amount && (
                <div className="mt-2 text-sm text-gray-500">
                  To'lov miqdori: {amount} so'm
                </div>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {["10000", "25000", "50000", "100000"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(FormatNumber(quickAmount))}
                  className="py-3 px-4 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300"
                >
                  {FormatNumber(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                To'lov usulini tanlang
              </h3>
              <p className="text-gray-600">
                Barcha to'lov usullari xavfsiz va tezkor
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result &&
                result.user.payments.bank.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedBank(method)}
                    className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedBank?.id === method.id
                        ? "ring-4 ring-blue-500 ring-opacity-50 shadow-2xl scale-105"
                        : "hover:shadow-xl hover:scale-102"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>

                    {method.popular && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Mashhur</span>
                      </div>
                    )}

                    <div className="relative p-6 bg-white border-2 border-gray-100 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}
                          >
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {method.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Bank kartasi
                            </p>
                          </div>
                        </div>
                        {selectedBank?.id === method.id && (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={method.img}
                          alt={method.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Payment Summary & Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  To'lov xulosasi
                </h3>
                <p className="text-gray-600">Barcha ma'lumotlarni tekshiring</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">To'lov miqdori:</span>
                <span className="font-bold text-lg">{amount || "0"} UZS</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Komissiya:</span>
                <span className="font-bold text-green-600">Bepul</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Jami:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {amount || "0"} UZS
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedBank || !amount || isProcessing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                !selectedBank || !amount || isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Jarayon...</span>
                </>
              ) : (
                <>
                  <span>To'lovni amalga oshirish</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>To'lov xavfsiz SSL shifrlash orqali himoyalangan</p>
            </div>
          </div>
        </main>

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Diqqat!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Belgilangan kiritgan summadan ko'p yoki kam qilingan
                  to'lovlarni qabul qilmaymiz va qaytarib ham berilmaydi. To'lov
                  qilishda hushyor bo'ling!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">
                    Muhim eslatma:
                  </span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• To'lov miqdorini aniq kiriting</li>
                  <li>• Xato to'lovlar qaytarilmaydi</li>
                  <li>• Barcha ma'lumotlarni tekshiring</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWarning(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={proceedWithPayment}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Davom etish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal &&
          paymentDetails &&
          result.user.payments.data.amount && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    To'lov ma'lumotlari
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Ushbu ma'lumotlar bilan to'lovni amalga oshiring
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Tranzaksiya ID:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-black">
                        {paymentDetails.transactionId}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(paymentDetails.transactionId)
                        }
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Karta raqami:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-black">
                        {paymentDetails.cardNumber}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(paymentDetails.cardNumber)
                        }
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Vaqt chegarasi:
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {paymentDetails.timeLimit} daqiqa
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Muhim!</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Aynan {paymentDetails.amount} UZS to'lang. Boshqa miqdorda
                    to'lovlar qaytarilmaydi!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelPayment}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Bekor qilish</span>
                  </button>
                  <button
                    onClick={handlePaymentComplete}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>To'lov qildim</span>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};
