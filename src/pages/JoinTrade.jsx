// src/pages/JoinTrade.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { FormatNumber } from "../components/FormatNumber";
import {
  CheckCircle,
  AlertTriangle,
  DollarSign,
  User,
  Clock,
  Shield,
  ArrowRight,
  X,
  Loader,
} from "lucide-react";

export const JoinTrade = () => {
  const { secretCode } = useParams();
  const navigate = useNavigate();
  const { joinTrade, isJoiningTrade, availableBalance, getTradeByCode } =
    useApi();

  const [tradeInfo, setTradeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadTradeInfo();
  }, [secretCode]);

  const loadTradeInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const trade = await getTradeByCode(secretCode);

      if (!trade) {
        throw new Error("Savdo topilmadi");
      }

      if (trade.status !== "active") {
        throw new Error("Bu savdo faol emas");
      }

      if (trade.partner_id) {
        throw new Error("Bu savdoga allaqachon qo'shilgan");
      }

      setTradeInfo(trade);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrade = async () => {
    try {
      await joinTrade(secretCode);
      navigate("/savdolar");
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateRequiredAmount = () => {
    if (!tradeInfo) return 0;

    const { amount, commission_amount, commission_type, creator_role } =
      tradeInfo;
    const partnerRole = creator_role === "seller" ? "buyer" : "seller";

    if (partnerRole === "buyer") {
      switch (commission_type) {
        case "creator":
          return amount;
        case "partner":
          return amount + commission_amount;
        case "split":
          return amount + commission_amount / 2;
        default:
          return amount;
      }
    }
    return 0;
  };

  const getCommissionText = () => {
    if (!tradeInfo) return "";

    const { commission_type } = tradeInfo;

    switch (commission_type) {
      case "creator":
        return "Yaratuvchi to'laydi";
      case "partner":
        return "Siz to'laysiz";
      case "split":
        return "Ortada";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Savdo ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !tradeInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Xatolik!</h2>
          <p className="text-gray-600 mb-6">{error || "Savdo topilmadi"}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const requiredAmount = calculateRequiredAmount();
  const hasEnoughBalance = availableBalance >= requiredAmount;
  const partnerRole = tradeInfo.creator_role === "seller" ? "buyer" : "seller";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-1">Savdoga qo'shilish</h1>
          <p className="text-blue-100 text-sm">
            Savdo ma'lumotlarini ko'ring va qo'shiling
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Trade Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Savdo ma'lumotlari
              </h2>
              <p className="text-sm text-gray-600">ID: #{tradeInfo.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mahsulot</p>
                  <p className="font-semibold text-gray-800">
                    {tradeInfo.trade_name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {FormatNumber(tradeInfo.amount)} UZS
                </p>
                <p className="text-sm text-gray-500">Savdo summasi</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yaratuvchi</p>
                  <p className="font-semibold text-gray-800">
                    {tradeInfo.creator_name || "Noma'lum"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-700 capitalize">
                  {tradeInfo.creator_role === "seller" ? "Sotuvchi" : "Xaridor"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Sizning rolingiz</p>
                </div>
                <p className="font-semibold text-green-700 capitalize">
                  {partnerRole === "seller" ? "Sotuvchi" : "Xaridor"}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <p className="text-sm text-gray-600">Komissiya</p>
                </div>
                <p className="font-semibold text-orange-700">
                  {getCommissionText()}
                </p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600">Komissiya summasi</p>
              </div>
              <p className="font-semibold text-purple-700">
                {FormatNumber(tradeInfo.commission_amount)} UZS
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {partnerRole === "buyer" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              To'lov ma'lumotlari
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Mahsulot narxi:</span>
                <span className="font-semibold">
                  {FormatNumber(tradeInfo.amount)} UZS
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Komissiya:</span>
                <span className="font-semibold">
                  {FormatNumber(tradeInfo.commission_amount)} UZS (
                  {getCommissionText()})
                </span>
              </div>

              <div className="flex justify-between py-2 font-bold text-lg">
                <span className="text-gray-800">Jami to'lov:</span>
                <span className="text-blue-600">
                  {FormatNumber(requiredAmount)} UZS
                </span>
              </div>
            </div>

            {/* Balance Check */}
            <div
              className={`mt-4 p-4 rounded-xl ${
                hasEnoughBalance
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {hasEnoughBalance ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`font-semibold ${
                    hasEnoughBalance ? "text-green-800" : "text-red-800"
                  }`}
                >
                  Balans holati
                </span>
              </div>
              <p
                className={`text-sm ${
                  hasEnoughBalance ? "text-green-700" : "text-red-700"
                }`}
              >
                Sizning balansingiz: {FormatNumber(availableBalance)} UZS
                {!hasEnoughBalance && (
                  <span className="block mt-1">
                    Yetishmaydi:{" "}
                    {FormatNumber(requiredAmount - availableBalance)} UZS
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pb-20">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Bekor qilish
          </button>

          <button
            onClick={() => {
              if (partnerRole === "buyer" && !hasEnoughBalance) {
                return;
              }
              setShowConfirmation(true);
            }}
            disabled={
              isJoiningTrade || (partnerRole === "buyer" && !hasEnoughBalance)
            }
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              !isJoiningTrade && (partnerRole === "seller" || hasEnoughBalance)
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isJoiningTrade ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Savdoga qo'shilish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Tasdiqlash</h2>
                  <p className="text-green-100 text-sm">
                    Savdoga qo'shilishni tasdiqlang
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Muhim!</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Savdoga qo'shilganingizdan so'ng, siz{" "}
                  {partnerRole === "seller" ? "sotuvchi" : "xaridor"}
                  sifatida javobgar bo'lasiz. Barcha shartlarni o'qib
                  chiqdingizmi?
                </p>
              </div>

              {partnerRole === "buyer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-semibold">
                    Sizning balansingizdan {FormatNumber(requiredAmount)} UZS
                    muzlatiladi.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleJoinTrade}
                  disabled={isJoiningTrade}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {isJoiningTrade ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                  ) : (
                    "Tasdiqlash"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
