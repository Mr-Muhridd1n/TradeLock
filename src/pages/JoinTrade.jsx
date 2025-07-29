// src/pages/JoinTrade.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/formatters";
import { showConfirm, hapticFeedback } from "../utils/telegram";
import {
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  User,
  DollarSign,
  Percent,
} from "lucide-react";

export const JoinTrade = () => {
  const { secretLink } = useParams();
  const navigate = useNavigate();
  const { trades, user, showSuccess, handleError } = useAppContext();
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const tradeData = await trades.getTradeById(secretLink);
        setTrade(tradeData);
      } catch (error) {
        handleError(new Error("Savdo topilmadi yoki faol emas"));
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (secretLink) {
      fetchTrade();
    }
  }, [secretLink]);

  const handleJoinTrade = () => {
    showConfirm(
      "Bu savdoga qo'shilishni tasdiqlaysizmi?",
      async (confirmed) => {
        if (confirmed) {
          try {
            setJoining(true);
            hapticFeedback("medium");

            await trades.joinTrade(secretLink);

            showSuccess("Savdoga muvaffaqiyatli qo'shildingiz!");
            hapticFeedback("success");
            navigate("/savdolar");
          } catch (error) {
            handleError(error);
            hapticFeedback("error");
          } finally {
            setJoining(false);
          }
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Savdo ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Savdo topilmadi
          </h2>
          <p className="text-gray-600 mb-4">
            Bu savdo mavjud emas yoki faol emas.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const requiredAmount =
    trade.amount +
    (trade.commission_type === "participant"
      ? trade.commission_amount
      : trade.commission_type === "split"
      ? trade.commission_amount / 2
      : 0);

  const hasEnoughBalance = user.user?.balance >= requiredAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Savdoga Qo'shilish</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Trade Info Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {trade.trade_name}
            </h2>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>Yaratuvchi: {trade.creator_name}</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Amount */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Savdo summasi</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(trade.amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Commission */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Komissiya</p>
                  <p className="text-lg font-bold text-gray-900">
                    {trade.commission_type === "creator" &&
                      "Yaratuvchi tomonidan"}
                    {trade.commission_type === "participant" &&
                      "Siz tomoningizdan"}
                    {trade.commission_type === "split" && "Ortada"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Summa</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatCurrency(trade.commission_amount)}
                </p>
              </div>
            </div>

            {/* Required Amount */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Sizdan talab qilinadi:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(requiredAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sizning balansingiz:</span>
                <span
                  className={`font-bold ${
                    hasEnoughBalance ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(user.user?.balance || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning or Success */}
        {!hasEnoughBalance ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">
                  Yetarli balans yo'q
                </h3>
                <p className="text-sm text-red-700">
                  Bu savdoga qo'shilish uchun hisobingizda yetarli mablag' yo'q.
                  Avval hisobingizni to'ldiring.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Tayyor!</h3>
                <p className="text-sm text-green-700">
                  Sizda yetarli balans mavjud. Savdoga qo'shilishingiz mumkin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasEnoughBalance ? (
            <button
              onClick={handleJoinTrade}
              disabled={joining}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all transform active:scale-95"
            >
              {joining ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Qo'shilmoqda...
                </div>
              ) : (
                "Savdoga Qo'shilish"
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/hamyon/toldirish")}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform active:scale-95"
            >
              Hisobni To'ldirish
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
          >
            Bekor Qilish
          </button>
        </div>
      </div>
    </div>
  );
};
