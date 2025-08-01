// src/pages/NewSavdoForm.jsx
import React, { useState } from "react";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  Info,
  ArrowRight,
  X,
  Copy,
} from "lucide-react";

export const NewSavdoForm = () => {
  const { createTrade, isCreatingTrade, balance, availableBalance } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    creator_role: "seller", // seller yoki buyer
    amount: "",
    commission_type: "creator", // creator, partner, split
    trade_name: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTrade, setCreatedTrade] = useState(null);

  const MIN_TRADE_AMOUNT = 1000;
  const MAX_TRADE_AMOUNT = 50000000;
  const COMMISSION_RATE = 0.02; // 2%

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    const amount = parseInt(formData.amount.replace(/\s/g, ""));
    if (!formData.amount || amount < MIN_TRADE_AMOUNT) {
      newErrors.amount = `Minimal savdo summasi ${FormatNumber(
        MIN_TRADE_AMOUNT
      )} so'm`;
    }
    if (amount > MAX_TRADE_AMOUNT) {
      newErrors.amount = `Maksimal savdo summasi ${FormatNumber(
        MAX_TRADE_AMOUNT
      )} so'm`;
    }

    // Trade name validation
    if (!formData.trade_name || formData.trade_name.length < 3) {
      newErrors.trade_name = "Savdo nomi kamida 3 ta belgi bo'lishi kerak";
    }

    // Balance validation for buyers
    if (formData.creator_role === "buyer") {
      const requiredAmount = calculateRequiredAmount();
      if (availableBalance < requiredAmount) {
        newErrors.balance = `Savdo yaratish uchun ${FormatNumber(
          requiredAmount
        )} so'm balans kerak`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRequiredAmount = () => {
    const amount = parseInt(formData.amount.replace(/\s/g, "")) || 0;
    const commission = amount * COMMISSION_RATE;

    if (formData.creator_role === "buyer") {
      switch (formData.commission_type) {
        case "creator":
          return amount + commission;
        case "split":
          return amount + commission / 2;
        case "partner":
          return amount;
        default:
          return amount;
      }
    }
    return 0;
  };

  const calculateNetAmount = () => {
    const amount = parseInt(formData.amount.replace(/\s/g, "")) || 0;
    const commission = amount * COMMISSION_RATE;

    if (formData.creator_role === "seller") {
      switch (formData.commission_type) {
        case "creator":
          return amount - commission;
        case "split":
          return amount - commission / 2;
        case "partner":
          return amount;
        default:
          return amount;
      }
    } else {
      return calculateRequiredAmount();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAmountChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    const formattedValue = cleanValue ? FormatNumber(cleanValue) : "";
    handleInputChange("amount", formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const tradeData = {
        ...formData,
        amount: parseInt(formData.amount.replace(/\s/g, "")),
      };

      const result = await createTrade(tradeData);

      if (result.success) {
        setCreatedTrade({
          id: result.trade_id,
          secret_code: result.secret_code,
          ...tradeData,
        });
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error creating trade:", error);
    }
  };

  const getCommissionText = () => {
    switch (formData.commission_type) {
      case "creator":
        return "Siz to'laysiz";
      case "partner":
        return formData.creator_role === "seller"
          ? "Xaridor to'laydi"
          : "Sotuvchi to'laydi";
      case "split":
        return "Ortada";
      default:
        return "";
    }
  };

  if (showSuccess && createdTrade) {
    return (
      <SuccessModal
        trade={createdTrade}
        onClose={() => navigate("/savdolar")}
      />
    );
  }

  return (
    <>
      <Header title="new_savdolar" />
      <main className="min-h-screen bg-gray-50">
        <section className="align-elements py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trade Type */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Savdo turi
                  </h3>
                  <p className="text-sm text-gray-600">Nima qilmoqchisiz?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.creator_role === "seller"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleInputChange("creator_role", "seller")}
                >
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Sotmoqchi</div>
                  <div className="text-xs opacity-75">Mahsulot sotish</div>
                </button>

                <button
                  type="button"
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.creator_role === "buyer"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleInputChange("creator_role", "buyer")}
                >
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Sotib olmoqchi</div>
                  <div className="text-xs opacity-75">Mahsulot sotib olish</div>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Savdo summasi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mahsulot narxini kiriting
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Savdo summasini kiriting"
                  className={`w-full p-4 text-xl font-semibold border-2 rounded-xl bg-gray-50 transition-all duration-300 outline-none ${
                    errors.amount
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-800 focus:border-blue-500 focus:bg-white"
                  }`}
                />
                <div className="absolute right-4 top-4 text-xl font-semibold text-gray-500">
                  UZS
                </div>
              </div>

              {errors.amount && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.amount}
                </div>
              )}
            </div>

            {/* Commission */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Percent className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Komissiya to'lovi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Kim komissiya to'laydi? (2%)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "creator", label: "Men to'layman" },
                  { key: "split", label: "Ortada" },
                  {
                    key: "partner",
                    label:
                      formData.creator_role === "seller"
                        ? "Xaridor to'laydi"
                        : "Sotuvchi to'laydi",
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                      formData.commission_type === option.key
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      handleInputChange("commission_type", option.key)
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Name */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Savdo nomi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mahsulot haqida qisqacha
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={formData.trade_name}
                onChange={(e) =>
                  handleInputChange("trade_name", e.target.value)
                }
                placeholder="Masalan: Telegram kanal"
                maxLength="50"
                className={`w-full p-4 border-2 rounded-xl bg-gray-50 transition-all duration-300 outline-none ${
                  errors.trade_name
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-800 focus:border-blue-500 focus:bg-white"
                }`}
              />

              {errors.trade_name && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.trade_name}
                </div>
              )}

              <div className="mt-2 text-sm text-gray-500">
                {formData.trade_name.length}/50 belgi
              </div>
            </div>

            {/* Summary */}
            {formData.amount && formData.trade_name && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Savdo xulosasi
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Mahsulot:</span>
                    <span className="font-semibold text-gray-800">
                      {formData.trade_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Summa:</span>
                    <span className="font-semibold text-gray-800">
                      {formData.amount} UZS
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Komissiya:</span>
                    <span className="font-semibold text-gray-800">
                      {getCommissionText()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Komissiya summasi:</span>
                    <span className="font-semibold text-gray-800">
                      {FormatNumber(
                        Math.floor(
                          (parseInt(formData.amount.replace(/\s/g, "")) || 0) *
                            COMMISSION_RATE
                        )
                      )}{" "}
                      UZS
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">
                      {formData.creator_role === "seller"
                        ? "Siz qabul qilasiz:"
                        : "Siz to'laysiz:"}
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        formData.creator_role === "seller"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {FormatNumber(calculateNetAmount())} UZS
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Error */}
            {errors.balance && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-800">
                      Balans yetarli emas
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      {errors.balance}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pb-20">
              <button
                type="button"
                onClick={() => navigate("/savdolar")}
                className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Bekor qilish
              </button>

              <button
                type="submit"
                disabled={
                  isCreatingTrade || !formData.amount || !formData.trade_name
                }
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isCreatingTrade && formData.amount && formData.trade_name
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isCreatingTrade ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Savdoni yaratish
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
};

// Success Modal Component
const SuccessModal = ({ trade, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Savdo yaratildi!</h2>
              <p className="text-green-100 text-sm">
                Muvaffaqiyatli amalga oshirildi
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Savdo ID:</span>
              <span className="font-semibold text-black">#{trade.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mahsulot:</span>
              <span className="font-semibold text-black">
                {trade.trade_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Summa:</span>
              <span className="font-semibold text-black">
                {FormatNumber(trade.amount)} UZS
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mahfiy kod:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-blue-600">
                  {trade.secret_code}
                </span>
                <button
                  onClick={() => copyToClipboard(trade.secret_code)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Keyingi qadamlar:
              </span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1 ml-7">
              <li>• Mahfiy kodni do'stingizga yuboring</li>
              <li>• Yoki "Ulashish" tugmasidan foydalaning</li>
              <li>• Hamkor qo'shilishini kuting</li>
              <li>• Savdoni yakunlang</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Savdolarni ko'rish
          </button>
        </div>
      </div>
    </div>
  );
};
