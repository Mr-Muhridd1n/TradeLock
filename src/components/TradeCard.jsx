// src/components/TradeCard.jsx - To'g'irlangan versiya
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
  Copy,
  Eye,
} from "lucide-react";

export const TradeCard = ({ trade }) => {
  const { user, trades, showSuccess, handleError } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleCopyLink = () => {
    if (trade.share_url) {
      navigator.clipboard
        .writeText(trade.share_url)
        .then(() => {
          showSuccess("Havola nusxa olindi!");
          hapticFeedback("light");
        })
        .catch(() => {
          // Fallback
          const textArea = document.createElement("textarea");
          textArea.value = trade.share_url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          showSuccess("Havola nusxa olindi!");
          hapticFeedback("light");
        });
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

  const getProgressColor = () => {
    switch (trade.status) {
      case "completed":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600";
    }
  };

  const otherUser = isCreator ? trade.participant_name : trade.creator_name;
  const otherUsername = isCreator
    ? trade.participant_username
    : trade.creator_username;

  const requiredAmount = isCreator
    ? trade.commission_type === "creator"
      ? trade.commission_amount
      : 0
    : trade.amount +
      (trade.commission_type === "participant" ? trade.commission_amount : 0);

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

        <div className="flex items-center space-x-2">
          {/* Details toggle button */}
          <button
            onClick={() => {
              setShowDetails(!showDetails);
              hapticFeedback("light");
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Share button for active trades created by user */}
          {trade.status === "active" && isCreator && trade.share_url && (
            <button
              onClick={handleShare}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Trade Info */}
      <div className="space-y-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {trade.trade_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
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

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {getTimeAgo(trade.created_at)}
          </div>
          <div className="text-right">
            <span className="capitalize">
              {trade.trade_type === "sell" ? "Sotish" : "Sotib olish"}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Info - Collapsible */}
      {showDetails && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3 border-l-4 border-blue-500">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Komissiya turi:</span>
              <div className="font-semibold">
                {trade.commission_type === "creator" && "Yaratuvchi to'laydi"}
                {trade.commission_type === "participant" &&
                  "Ishtirokchi to'laydi"}
                {trade.commission_type === "split" && "Teng taqsimlash"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Kerakli summa:</span>
              <div className="font-semibold text-green-600">
                {formatCurrency(requiredAmount)}
              </div>
            </div>
          </div>

          {trade.share_url && isCreator && (
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Ulashish havolasi:
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={trade.share_url}
                  readOnly
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getProgressColor()} h-2 rounded-full transition-all duration-500 ${getProgressWidth()}`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Yaratildi</span>
          {trade.status === "in_progress" && <span>Jarayonda</span>}
          <span>
            {trade.status === "completed"
              ? "Yakunlandi"
              : trade.status === "cancelled"
                ? "Bekor qilindi"
                : "Tugash"}
          </span>
        </div>
      </div>

      {/* Confirmation Status */}
      {trade.status === "in_progress" && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Tasdiqlash holati:
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              {trade.creator_confirmed ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              )}
              <span>
                Yaratuvchi:{" "}
                <span
                  className={
                    trade.creator_confirmed
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {trade.creator_confirmed ? "✓" : "⏳"}
                </span>
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
                <span
                  className={
                    trade.participant_confirmed
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {trade.participant_confirmed ? "✓" : "⏳"}
                </span>
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
          <button
            onClick={() => {
              const telegramUrl = otherUsername.startsWith("@")
                ? `https://t.me/${otherUsername.slice(1)}`
                : `https://t.me/${otherUsername}`;
              window.open(telegramUrl, "_blank");
              hapticFeedback("light");
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Aloqa</span>
          </button>
        )}

        {/* Details button for completed/cancelled trades */}
        {["completed", "cancelled"].includes(trade.status) && (
          <button
            onClick={() => {
              setShowDetails(!showDetails);
              hapticFeedback("light");
            }}
            className="flex items-center justify-center gap-2 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-all transform active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Tafsilotlar</span>
          </button>
        )}

        {/* Share button for active trades without participant */}
        {trade.status === "active" && isCreator && !trade.participant_id && (
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all transform active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Ulashish</span>
          </button>
        )}
      </div>

      {/* Additional Info for Completed/Cancelled */}
      {(trade.status === "completed" || trade.status === "cancelled") &&
        showDetails && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
            <div className="text-sm text-gray-600">
              {trade.status === "completed" && (
                <>
                  <div className="flex items-center mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Muvaffaqiyatli yakunlandi</span>
                  </div>
                  {trade.completed_at && (
                    <div className="text-xs text-gray-500">
                      Yakunlanish vaqti: {getTimeAgo(trade.completed_at)}
                    </div>
                  )}
                </>
              )}
              {trade.status === "cancelled" && (
                <>
                  <div className="flex items-center mb-1">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span>Bekor qilindi</span>
                  </div>
                  {trade.cancelled_at && (
                    <div className="text-xs text-gray-500">
                      Bekor qilish vaqti: {getTimeAgo(trade.cancelled_at)}
                    </div>
                  )}
                  {trade.cancel_reason && (
                    <div className="text-xs text-gray-500 mt-1">
                      Sabab: {trade.cancel_reason}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};
