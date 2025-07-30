// src/components/Sotuvchi.jsx
import React from "react";
import { formatCurrency, getTimeAgo } from "../utils/formatters";
import { User, DollarSign, Clock, MessageCircle, Share2 } from "lucide-react";

export const Sotuvchi = ({ trade, onContact, onShare }) => {
  if (!trade) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Sotuvchi Ma'lumotlari
        </h3>
        {onShare && (
          <button
            onClick={() => onShare(trade)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Seller Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {trade.creator_name || "Nomalum foydalanuvchi"}
            </p>
            <p className="text-sm text-gray-500">
              @{trade.creator_username || "username"}
            </p>
          </div>
        </div>

        {/* Trade Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Savdo summasi:</span>
            </div>
            <span className="font-bold text-green-600">
              {formatCurrency(trade.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Yaratilgan:</span>
            </div>
            <span className="text-sm text-gray-500">
              {getTimeAgo(trade.created_at)}
            </span>
          </div>
        </div>

        {/* Trade Name */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Savdo nomi:</p>
          <p className="font-semibold text-gray-800">{trade.trade_name}</p>
        </div>

        {/* Commission Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Komissiya:</span>{" "}
            {trade.commission_type === "creator" && "Sotuvchi tomonidan"}
            {trade.commission_type === "participant" && "Xaridor tomonidan"}
            {trade.commission_type === "split" && "Ikkala tomon o'rtasida"} (
            {formatCurrency(trade.commission_amount)})
          </p>
        </div>

        {/* Action Buttons */}
        {onContact && trade.creator_username && (
          <div className="pt-2">
            <button
              onClick={() => onContact(trade)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Sotuvchi bilan bog'lanish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
