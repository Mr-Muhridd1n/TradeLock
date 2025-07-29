// src/components/TradeCard.jsx
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  formatCurrency,
  getTimeAgo,
  getTradeStatusText,
} from "../utils/formatters";
import { hapticFeedback, showConfirm, shareTradeLink } from "../utils/telegram";
import {
  Clock,
  User,
  DollarSign,
  Share2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

export const TradeCard = ({ trade }) => {
  const { user, trades, showSuccess, handleError } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = trade.creator_id === user.user?.id;
  const isParticipant = trade.participant_id === user.user?.id;
  const canConfirm =
    trade.status === "in_progress" &&
    ((isCreator && !trade.creator_confirmed) ||
      (isParticipant && !trade.participant_confirmed));

  const canCancel =
    ["active", "in_progress"].includes(trade.status) &&
    (isCreator || isParticipant);

  const handleConfirm = () => {
    showConfirm("Bu savdoni tasdiqlashni xohlaysizmi?", async (confirmed) => {
      if (confirmed) {
        try {
          setIsLoading(true);
          hapticFeedback("medium");

          await trades.confirmTrade(trade.id);
          showSuccess("Savdo tasdiqlandi!");
          hapticFeedback("success");
        } catch (error) {
          handleError(error);
          hapticFeedback("error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleCancel = () => {
    showConfirm(
      "Bu savdoni bekor qilishni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.",
      async (confirmed) => {
        if (confirmed) {
          try {
            setIsLoading(true);
            hapticFeedback("medium");

            await trades.cancelTrade(trade.id);
            showSuccess("Savdo bekor qilindi!");
            hapticFeedback("success");
          } catch (error) {
            handleError(error);
            hapticFeedback("error");
          } finally {
            setIsLoading(false);
          }
        }
      }
    );
  };

  const handleShare = () => {
    if (trade.secret_link) {
      const shareUrl = `https://t.me/Trade_Lock_bot?start=trade_${trade.secret_link}`;
      shareTradeLink(shareUrl);
      hapticFeedback("light");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressWidth = () => {
    switch (trade.status) {
      case "active":
        return "w-1/4";
      case "in_progress":
        return "w-3/4";
      case "completed":
        return "w-full";
      case "cancelled":
        return "w-1/4";
      default:
        return "w-0";
    }
  };

  const otherUser = isCreator ? trade.participant_name : trade.creator_name;
  const otherUsername = isCreator
    ? trade.participant_username
    : trade.creator_username;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-gray-700">#{trade.id}</span>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
              trade.status
            )}`}
          >
            {getTradeStatusText(trade.status)}
          </div>
        </div>

        {trade.status === "active" && isCreator && (
          <button
            onClick={handleShare}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Trade Info */}
      <div className="space-y-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {trade.trade_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>
              {isCreator
                ? otherUser
                  ? `Ishtirokchi: ${otherUser}`
                  : "Ishtirokchi kutilmoqda..."
                : `Yaratuvchi: ${trade.creator_name}`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold text-gray-900">
            <DollarSign className="w-5 h-5 mr-1" />
            {formatCurrency(trade.amount)}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">Komissiya</div>
            <div className="text-sm font-semibold text-orange-600">
              {formatCurrency(trade.commission_amount)}
            </div>
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {getTimeAgo(trade.created_at)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ${getProgressWidth()}`}
          ></div>
        </div>
      </div>

      {/* Confirmation Status */}
      {trade.status === "in_progress" && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Tasdiqlash holati:
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              {trade.creator_confirmed ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              )}
              <span>
                Yaratuvchi:{" "}
                {trade.creator_confirmed ? "Tasdiqlangan" : "Kutilmoqda"}
              </span>
            </div>
            <div className="flex items-center">
              {trade.participant_confirmed ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              )}
              <span>
                Ishtirokchi:{" "}
                {trade.participant_confirmed ? "Tasdiqlangan" : "Kutilmoqda"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {canConfirm && (
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Tasdiqlash
              </>
            )}
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Bekor qilish
          </button>
        )}

        {/* Contact button for active trades with participant */}
        {otherUsername && ["active", "in_progress"].includes(trade.status) && (
          <a
            href={
              otherUsername.startsWith("@")
                ? `https://t.me/${otherUsername.slice(1)}`
                : `tg://user?id=${otherUsername}`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => hapticFeedback("light")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Aloqa
          </a>
        )}

        {/* Details button for completed/cancelled trades */}
        {["completed", "cancelled"].includes(trade.status) && (
          <button
            onClick={() => hapticFeedback("light")}
            className="flex items-center justify-center gap-2 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-all transform active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Tafsilotlar
          </button>
        )}
      </div>
    </div>
  );
};
