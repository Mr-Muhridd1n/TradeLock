// src/components/PaymentCard.jsx
import React from "react";
import {
  formatCurrency,
  getTimeAgo,
  getPaymentTypeText,
  getPaymentStatusText,
} from "../utils/formatters";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export const PaymentCard = ({ payment, hideBalance = false }) => {
  const getIcon = () => {
    switch (payment.type) {
      case "deposit":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "withdraw":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case "transfer":
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (payment.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAmountColor = () => {
    switch (payment.type) {
      case "deposit":
      case "trade_earn":
      case "bonus":
        return "text-green-600";
      case "withdraw":
      case "commission":
      case "penalty":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getAmountPrefix = () => {
    switch (payment.type) {
      case "deposit":
      case "trade_earn":
      case "bonus":
        return "+";
      case "withdraw":
      case "commission":
      case "penalty":
        return "-";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {getPaymentTypeText(payment.type)}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getTimeAgo(payment.created_at)}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="text-xs text-gray-500">
                  {getPaymentStatusText(payment.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${getAmountColor()}`}>
            {hideBalance
              ? "••• •••"
              : `${getAmountPrefix()}${formatCurrency(payment.amount)}`}
          </p>
          {payment.reference && (
            <p className="text-xs text-gray-400">#{payment.reference}</p>
          )}
        </div>
      </div>

      {payment.description && (
        <p className="text-sm text-gray-600 mt-2 truncate">
          {payment.description}
        </p>
      )}

      {payment.card_number && (
        <p className="text-xs text-gray-500 mt-1">
          **** **** **** {payment.card_number.slice(-4)}
        </p>
      )}
    </div>
  );
};
