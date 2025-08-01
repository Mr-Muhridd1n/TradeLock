// src/components/SavdoDetails.jsx
import React from "react";
import { FormatNumber } from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import {
  X,
  DollarSign,
  User,
  Percent,
  Receipt,
  Clock,
  MessageCircle,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  Calendar,
} from "lucide-react";
import { showToast } from "../utils/toast";

export const SavdoDetails = ({ setView, data }) => {
  const timeAgo = TimeAgo(data.created_at || data.time);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast.success("Nusxalandi");
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "from-blue-50 to-blue-100 border-blue-500 text-blue-700";
      case "completed":
        return "from-green-50 to-green-100 border-green-500 text-green-700";
      case "cancelled":
        return "from-red-50 to-red-100 border-red-500 text-red-700";
      default:
        return "from-gray-50 to-gray-100 border-gray-500 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Faol";
      case "completed":
        return "Yakunlangan";
      case "cancelled":
        return "Bekor qilingan";
      default:
        return status;
    }
  };

  const getCommissionText = () => {
    switch (data.commission_type) {
      case "creator":
        return "Yaratuvchi to'laydi";
      case "partner":
        return "Hamkor to'laydi";
      case "split":
        return "Ortada";
      default:
        return "Noma'lum";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setView(null)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 relative">
          <button
            onClick={() => setView(null)}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Receipt className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Savdo #{data.id}</h2>
              <p className="text-blue-100 text-sm">
                {data.trade_name || data.savdoName || "Nomsiz savdo"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div
            className={`p-4 bg-gradient-to-r ${getStatusColor(
              data.status || data.holat
            )} rounded-xl border-l-4 flex items-center gap-3`}
          >
            {getStatusIcon(data.status || data.holat)}
            <div>
              <p className="font-semibold">Holat</p>
              <p className="text-sm capitalize">
                {getStatusText(data.status || data.holat)}
              </p>
            </div>
            <div className="ml-auto text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {timeAgo}
            </div>
          </div>

          {/* Sale Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Savdo summasi</p>
                  <p className="text-lg font-bold text-gray-900">
                    {FormatNumber(data.amount || data.value)} so'm
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(data.amount || data.value)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {data.creator_role === "seller" ||
                    data.status === "sotuvchi"
                      ? "Xaridor"
                      : "Sotuvchi"}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.partner_name || data.user_target || "Hali topilmadi"}
                  </p>
                </div>
              </div>
              {(data.partner_name || data.user_target) && (
                <a
                  href={
                    (data.partner_name || data.user_target).charAt(0) === "@"
                      ? `https://t.me/${(
                          data.partner_name || data.user_target
                        ).slice(1)}`
                      : `tg://user?id=${data.partner_name || data.user_target}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="text-orange-500" size={16} />
                  <p className="text-sm text-gray-600">Komissiya</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {getCommissionText()}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-purple-500" size={16} />
                  <p className="text-sm text-gray-600">Komissiya</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {FormatNumber(data.commission_amount || data.komissiyaValue)}{" "}
                  so'm
                </p>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-indigo-500" size={20} />
              <h3 className="font-semibold text-indigo-800">
                Sizning rolingiz
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-600">Siz:</span>
                <span className="font-medium text-indigo-800 capitalize">
                  {data.creator_role || data.status}
                </span>
              </div>
              {data.secret_code && (
                <div className="flex justify-between text-sm items-center">
                  <span className="text-indigo-600">Mahfiy kod:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-indigo-800">
                      {data.secret_code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(data.secret_code)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Savdo jarayoni</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white" size={14} />
                </div>
                <span className="text-sm text-gray-600">Savdo yaratildi</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    data.partner_name || data.user_target
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  {data.partner_name || data.user_target ? (
                    <CheckCircle className="text-white" size={14} />
                  ) : (
                    <Clock className="text-gray-500" size={14} />
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {data.creator_role === "seller" || data.status === "sotuvchi"
                    ? "Xaridor"
                    : "Sotuvchi"}{" "}
                  topildi
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    (data.status || data.holat) === "completed" ||
                    (data.status || data.holat) === "yakunlangan"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  {(data.status || data.holat) === "completed" ||
                  (data.status || data.holat) === "yakunlangan" ? (
                    <CheckCircle className="text-white" size={14} />
                  ) : (
                    <Clock className="text-gray-500" size={14} />
                  )}
                </div>
                <span className="text-sm text-gray-600">Savdo yakunlandi</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {(data.status || data.holat) === "active" &&
              (data.partner_name || data.user_target) && (
                <a
                  href={
                    (data.partner_name || data.user_target).charAt(0) === "@"
                      ? `https://t.me/${(
                          data.partner_name || data.user_target
                        ).slice(1)}`
                      : `tg://user?id=${data.partner_name || data.user_target}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 
                           bg-gradient-to-r from-blue-600 to-blue-500 text-white 
                           hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:scale-105
                           active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={18} />
                  Aloqa
                </a>
              )}

            <button
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                         bg-gradient-to-r from-gray-600 to-gray-500 text-white 
                         hover:from-gray-700 hover:to-gray-600 hover:shadow-lg hover:scale-105
                         active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => setView(null)}
            >
              <X size={18} />
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
