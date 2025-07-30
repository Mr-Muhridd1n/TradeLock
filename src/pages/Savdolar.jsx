// src/pages/Savdolar.jsx (Updated)
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  formatCurrency,
  validateAmount,
  validateTradeName,
} from "../utils/formatters";
import { shareTradeLink, hapticFeedback, showConfirm } from "../utils/telegram";
import { TradeCard } from "../components/TradeCard";
import { AlertTriangle, Copy, CheckCircle } from "lucide-react";

export const Savdolar = () => {
  const { action } = useParams();
  const navigate = useNavigate();
  const { trades, user, handleError } = useAppContext();

  const [activeTab, setActiveTab] = useState("faol");
  const [formData, setFormData] = useState({
    trade_type: "sell",
    trade_name: "",
    amount: "",
    commission_type: "creator",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccessModal] = useState(false);
  const [createdTrade, setCreatedTrade] = useState(null);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const amountError = validateAmount(formData.amount);
    if (amountError) {
      handleError(new Error(amountError));
      return false;
    }

    const nameError = validateTradeName(formData.trade_name);
    if (nameError) {
      handleError(new Error(nameError));
      return false;
    }

    // Check balance for commission
    if (formData.commission_type === "creator") {
      const commissionAmount = (parseFloat(formData.amount) * 2) / 100;
      if (user.user.balance < commissionAmount) {
        handleError(new Error("Komissiya uchun yetarli balans yo'q"));
        return false;
      }
    }

    return true;
  };

  const handleCreateTrade = async () => {
    if (!validateForm()) return;

    try {
      setIsCreating(true);
      hapticFeedback("medium");

      const result = await trades.createTrade({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      setCreatedTrade(result);
      setShowSuccessModal(true);
      hapticFeedback("success");
    } catch (error) {
      handleError(error);
      hapticFeedback("error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleShareTrade = () => {
    if (createdTrade?.share_url) {
      shareTradeLink(createdTrade.share_url);
      hapticFeedback("light");
    }
  };

  if (action === "new") {
    return (
      <NewTradeForm
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleCreateTrade}
        isCreating={isCreating}
        showSuccessModal={showSuccess}
        createdTrade={createdTrade}
        onShare={handleShareTrade}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/savdolar");
        }}
      />
    );
  }

  const filteredTrades = trades.trades.filter((trade) => {
    switch (activeTab) {
      case "faol":
        return ["active", "in_progress"].includes(trade.status);
      case "tarix":
        return ["completed", "cancelled"].includes(trade.status);
      default:
        return true;
    }
  });

  const stats = {
    faol: trades.trades.filter((t) =>
      ["active", "in_progress"].includes(t.status)
    ).length,
    yakunlangan: trades.trades.filter((t) => t.status === "completed").length,
    bekor: trades.trades.filter((t) => t.status === "cancelled").length,
  };

  return (
    <>
      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-5">
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.faol}
              </div>
              <div className="text-xs text-[#7f8c8d]">Faol</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.yakunlangan}
              </div>
              <div className="text-xs text-[#7f8c8d]">Yakunlangan</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.bekor}
              </div>
              <div className="text-xs text-[#7f8c8d]">Bekor qilingan</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl shadow-md p-1 mb-5">
            {["faol", "tarix", "hammasi"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  hapticFeedback("selection");
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white"
                    : "text-[#7f8c8d]"
                }`}
              >
                {tab === "faol"
                  ? "Faol"
                  : tab === "tarix"
                    ? "Tarix"
                    : "Hammasi"}
              </button>
            ))}
          </div>

          {/* Trades List */}
          <div className="space-y-4 pb-24">
            <Link
              to="/savdolar/new"
              onClick={() => hapticFeedback("medium")}
              className="block w-full bg-gradient-to-r from-[#04ebd8] to-[#00ff8c] text-white text-xl font-semibold text-center py-4 rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              Yangi savdo ochish
            </Link>

            {filteredTrades.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Savdolar yo'q
                </h3>
                <p className="text-gray-600 mb-4">
                  Hali birorta savdo yaratilmagan
                </p>
                <Link
                  to="/savdolar/new"
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Birinchi savdoni yarating
                </Link>
              </div>
            ) : (
              filteredTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
};

// NewTradeForm Component
const NewTradeForm = ({
  formData,
  onFormChange,
  onSubmit,
  isCreating,
  showSuccessModal,
  createdTrade,
  onShare,
  onClose,
}) => {
  const commissionAmount = (parseFloat(formData.amount || 0) * 2) / 100;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white">
        <div className="flex flex-col text-center py-6">
          <h1 className="text-2xl font-bold">Yangi Savdo</h1>
          <p className="opacity-90">Savdolaringiz uchun sozlamalarni sozlang</p>
        </div>
      </div>

      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto py-5 space-y-6">
          {/* Trade Type */}
          <div>
            <p className="text-base font-semibold text-gray-500 mb-3">
              Nima qilmoqchisiz?
            </p>
            <div className="flex bg-white rounded-2xl shadow-md p-1">
              <button
                onClick={() => onFormChange("trade_type", "sell")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  formData.trade_type === "sell"
                    ? "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white"
                    : "text-[#7f8c8d]"
                }`}
              >
                Sotmoqchi
              </button>
              <button
                onClick={() => onFormChange("trade_type", "buy")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  formData.trade_type === "buy"
                    ? "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white"
                    : "text-[#7f8c8d]"
                }`}
              >
                Sotib olmoqchi
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-semibold text-gray-500">
                Savdo summasini kiriting!
              </p>
              {formData.amount && (
                <p className="text-sm font-semibold text-blue-500">
                  {formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
              )}
            </div>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                onFormChange("amount", value);
              }}
              placeholder="Savdo summasini kiriting!"
              className="w-full bg-white rounded-2xl shadow-md p-4 text-gray-500 text-base font-semibold outline-none"
            />
          </div>

          {/* Commission Type */}
          <div>
            <p className="text-base font-semibold text-gray-500 mb-3">
              Komissiya kim tomonidan beriladi? (2%)
            </p>
            <div className="flex bg-white rounded-2xl shadow-md p-1">
              {[
                { key: "creator", label: "Men tomonimdan" },
                { key: "split", label: "O'rtada" },
                {
                  key: "participant",
                  label:
                    formData.trade_type === "sell"
                      ? "Oluvchi tomonidan"
                      : "Sotuvchi tomonidan",
                },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => onFormChange("commission_type", key)}
                  className={`flex-1 py-3 px-2 rounded-xl font-semibold text-xs transition-all ${
                    formData.commission_type === key
                      ? "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white"
                      : "text-[#7f8c8d]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Trade Name */}
          <div>
            <p className="text-base font-semibold text-gray-500 mb-3">
              Savdo uchun nom bering! (Maksimal: 50 ta belgi)
            </p>
            <input
              type="text"
              value={formData.trade_name}
              onChange={(e) =>
                onFormChange("trade_name", e.target.value.slice(0, 50))
              }
              placeholder="Savdo uchun nom kiriting!"
              className="w-full bg-white rounded-2xl shadow-md p-4 text-gray-500 text-base font-semibold outline-none"
            />
          </div>

          {/* Preview */}
          {formData.amount && (
            <TradePreview
              formData={formData}
              commissionAmount={commissionAmount}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3 pb-6">
            <button
              onClick={onSubmit}
              disabled={!formData.amount || !formData.trade_name || isCreating}
              className="flex-1 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all transform active:scale-95"
            >
              {isCreating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Yaratilmoqda...
                </div>
              ) : (
                "Savdoni Boshlash"
              )}
            </button>
            <Link
              to="/savdolar"
              className="flex-1 bg-gradient-to-r from-[#fe4f4f] to-[#fea900] text-white py-4 rounded-xl font-bold text-lg text-center hover:shadow-lg transition-all transform active:scale-95"
            >
              Bekor Qilish
            </Link>
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && createdTrade && (
        <SuccessModal
          trade={createdTrade}
          onShare={onShare}
          onClose={onClose}
        />
      )}
    </>
  );
};

// Success Modal Component
const SuccessModal = ({ trade, onShare, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Savdo Yaratildi!</h2>
        <p className="text-green-100 text-sm">Muvaffaqiyatli yaratildi</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">
              Kerakli harakatlar:
            </span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Savdo havolasini nusxa oling</li>
            <li>• Savdo qilmoqchi bo'lgan do'stingizga yuboring</li>
            <li>• Savdoni boshlashini so'rang</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onShare}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Ulashish
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Trade Preview Component
const TradePreview = ({ formData, commissionAmount }) => {
  const amount = parseFloat(formData.amount) || 0;
  const finalAmount =
    formData.trade_type === "sell"
      ? formData.commission_type === "creator"
        ? amount - commissionAmount
        : formData.commission_type === "split"
          ? amount - commissionAmount / 2
          : amount
      : formData.commission_type === "creator"
        ? amount + commissionAmount
        : formData.commission_type === "split"
          ? amount + commissionAmount / 2
          : amount;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Savdo Xulasasi</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Savdo nomi:</span>
          <span className="font-semibold">
            {formData.trade_name || "Nomalum"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Savdo summasi:</span>
          <span className="font-semibold">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Komissiya:</span>
          <span className="font-semibold">
            {formData.commission_type === "creator"
              ? "Sizdan"
              : formData.commission_type === "split"
                ? "Ortada"
                : formData.trade_type === "sell"
                  ? "Oluvchi tomonidan"
                  : "Sotuvchi tomonidan"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Komissiya summasi:</span>
          <span className="font-semibold">
            {formatCurrency(commissionAmount)}
          </span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-gray-600">
              {formData.trade_type === "sell"
                ? "Siz qabul qilasiz:"
                : "Siz to'laysiz:"}
            </span>
            <span
              className={`font-bold text-lg ${
                formData.trade_type === "sell"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(finalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
