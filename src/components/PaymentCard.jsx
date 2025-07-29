// src/components/PaymentCard.jsx
import React from "react";
import {
  formatCurrency,
  getTimeAgo,
  getPaymentStatusText,
} from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export const PaymentCard = ({ payment, hideBalance }) => {
  const getPaymentIcon = (type) => {
    switch (type) {
      case "deposit":
        return <TrendingUp className="w-5 h-5" />;
      case "withdraw":
        return <TrendingDown className="w-5 h-5" />;
      case "trade_earn":
        return <Users className="w-5 h-5" />;
      case "trade_pay":
        return <Users className="w-5 h-5" />;
      case "commission":
        return <CreditCard className="w-5 h-5" />;
      case "transfer":
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentColor = (type) => {
    switch (type) {
      case "deposit":
      case "trade_earn":
        return "text-green-600 bg-green-100";
      case "withdraw":
      case "trade_pay":
      case "commission":
      case "transfer":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentTitle = (type) => {
    switch (type) {
      case "deposit":
        return "Hisob to'ldirish";
      case "withdraw":
        return "Mablag' chiqarish";
      case "trade_earn":
        return "Savdodan daromad";
      case "trade_pay":
        return "Savdo to'lovi";
      case "commission":
        return "Komissiya";
      case "transfer":
        return "O'tkazma";
      default:
        return "Tranzaksiya";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const isPositive = ["deposit", "trade_earn"].includes(payment.type);

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer transform active:scale-95"
      onClick={() => hapticFeedback("light")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${getPaymentColor(
              payment.type
            )}`}
          >
            {getPaymentIcon(payment.type)}
          </div>
          <div>
            <div className="font-semibold text-gray-800 mb-1">
              {getPaymentTitle(payment.type)}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500">
                {getTimeAgo(payment.created_at)}
              </div>
              {payment.status !== "completed" && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon(payment.status)}
                  <span className="text-xs text-gray-500">
                    {getPaymentStatusText(payment.status)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-bold text-lg ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {hideBalance
              ? "••• •••"
              : `${isPositive ? "+" : "-"}${formatCurrency(payment.amount)}`}
          </div>
          {payment.reference && (
            <div className="text-xs text-gray-500">#{payment.reference}</div>
          )}
        </div>
      </div>
    </div>
  );
};
