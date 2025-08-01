
// src/components/Toldirish.jsx - To'ldirish komponenti
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormatNumber } from "./FormatNumber";
import { showToast } from "../utils/toast";
import {
  CreditCard,
  Shield,
  ArrowRight,
  Check,
  Star,
  X,
  AlertTriangle,
  Copy,
  CheckCircle
} from "lucide-react";

export const Toldirish = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const banks = [
    {
      id: 1,
      name: "Humo",
      img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop&crop=center",
      color: "from-blue-500 to-blue-600",
      popular: true,
    },
    {
      id: 2,
      name: "Uzcard",
      img: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=200&h=120&fit=crop&crop=center",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      name: "Visa",
      img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=200&h=120&fit=crop&crop=center",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      name: "Mastercard",
      img: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=200&h=120&fit=crop&crop=center",
      color: "from-red-500 to-red-600",
    },
  ];

  const handleAmountChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const formattedValue = cleanValue ? FormatNumber(cleanValue) : '';
    setAmount(formattedValue);
  };

  const handleSubmit = async () => {
    if (!amount || !selectedBank) {
      showToast.error("Summa va to'lov usulini tanlang");
      return;
    }

    const numericAmount = parseInt(amount.replace(/\s/g, ''));
    if (numericAmount < 1000) {
      showToast.error("Minimal to'lov summasi 1,000 so'm");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      showToast.success("To'lov muvaffaqiyatli amalga oshirildi!");
      
      setTimeout(() => {
        navigate('/hamyon');
      }, 2000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Muvaffaqiyatli!</h3>
          <p className="text-gray-600 mb-4">To'lov amalga oshirildi</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              {FormatNumber(amount)} UZS hisobingizga qo'shildi
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    < className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/hamyon')} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hisob to'ldirish</h1>
                <p className="text-sm text-gray-600">Xavfsiz to'lov tizimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Himoyalangan</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Amount Input */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">To'lov summasi</h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Summani kiriting"
              className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
            <div className="absolute right-4 top-4 text-xl font-semibold text-gray-500">UZS</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {["10000", "25000", "50000", "100000"].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(FormatNumber(quickAmount))}
                className="py-2 px-3 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:text-blue-600 transition-all"
              >
                {FormatNumber(quickAmount)}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">To'lov usuli</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <div
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedBank?.id === bank.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {bank.popular && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Mashhur
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${bank.color} rounded-lg flex items-center justify-center`}>
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{bank.name}</h3>
                      <p className="text-sm text-gray-500">Bank kartasi</p>
                    </div>
                  </div>
                  {selectedBank?.id === bank.id && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={bank.img}
                    alt={bank.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">To'lov xulosasi</h2>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">To'lov summasi:</span>
              <span className="font-semibold">{amount || "0"} UZS</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Komissiya:</span>
              <span className="font-semibold text-green-600">Bepul</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Jami:</span>
                <span className="text-xl font-bold text-blue-600">{amount || "0"} UZS</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!amount || !selectedBank || isProcessing}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              !amount || !selectedBank || isProcessing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <span>To'lovni amalga oshirish</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </main>