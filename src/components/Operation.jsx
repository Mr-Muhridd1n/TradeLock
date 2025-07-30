// src/components/Operation.jsx
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
  ArrowRightLeft,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

export const Operation = ({ operation, hideBalance = false }) => {
  const getIcon = () => {
    switch (operation.type) {
      case "deposit":
        return <TrendingUp className="w-5 h-5" />;
      case "withdraw":
        return <TrendingDown className="w-5 h-5" />;
      case "transfer":
        return <ArrowRightLeft className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusIcon = () => {
    switch (operation.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (operation.type) {
      case "deposit":
      case "trade_earn":
      case "bonus":
        return "text-green-600 bg-green-50";
      case "withdraw":
      case "commission":
      case "penalty":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getAmountPrefix = () => {
    switch (operation.type) {
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor()}`}
          >
            {getIcon()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {getPaymentTypeText(operation.type)}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {getTimeAgo(operation.created_at)}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="text-xs text-gray-500">
                  {getPaymentStatusText(operation.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-bold text-lg ${operation.type === "deposit" || operation.type === "trade_earn" || operation.type === "bonus" ? "text-green-600" : "text-red-600"}`}
          >
            {hideBalance
              ? "••• •••"
              : `${getAmountPrefix()}${formatCurrency(operation.amount)}`}
          </p>
          {operation.reference && (
            <p className="text-xs text-gray-400">#{operation.reference}</p>
          )}
        </div>
      </div>

      {operation.description && (
        <p className="text-sm text-gray-600 mt-3 pl-13">
          {operation.description}
        </p>
      )}
    </div>
  );
};
