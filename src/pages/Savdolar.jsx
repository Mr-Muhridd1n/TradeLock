// src/pages/Savdolar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { TimeAgo } from "../components/TimeAgo";
import { useApi } from "../context/ApiContext";
import { SavdoDetails } from "../components/SavdoDetails";
import { SavdoShare } from "../components/SavdoShare";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Share2,
  MessageCircle,
  AlertTriangle,
  User,
  DollarSign,
} from "lucide-react";

export const Savdolar = () => {
  const {
    trades,
    isLoading,
    completeTrade,
    cancelTrade,
    isCompletingTrade,
    isCancelingTrade,
  } = useApi();

  const [filterType, setFilterType] = useState("faol");
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
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

  const filteredTrades = trades.filter((trade) => {
    switch (filterType) {
      case "faol":
        return trade.status === "active";
      case "tarix":
        return trade.status === "completed" || trade.status === "cancelled";
      case "hammasi":
        return true;
      default:
        return true;
    }
  });

  const faolCount = trades.filter((t) => t.status === "active").length;
  const yakunlanganCount = trades.filter(
    (t) => t.status === "completed"
  ).length;
  const bekorQilinganCount = trades.filter(
    (t) => t.status === "cancelled"
  ).length;

  const handleTradeComplete = async (tradeId) => {
    if (window.confirm("Rostdan ham bu savdoni yakunlamoqchimisiz?")) {
      try {
        await completeTrade(tradeId);
      } catch (error) {
        console.error("Error completing trade:", error);
      }
    }
  };

  const handleTradeCancel = async (tradeId) => {
    if (window.confirm("Rostdan ham bu savdoni bekor qilmoqchimisiz?")) {
      try {
        await cancelTrade(tradeId);
      } catch (error) {
        console.error("Error cancelling trade:", error);
      }
    }
  };

  const openTradeDetails = (trade) => {
    setSelectedTrade(trade);
    setShowDetails(true);
  };

  const openShareModal = (trade) => {
    setSelectedTrade({
      ...trade,
      secretCode: trade.secret_code,
    });
    setShowShare(true);
  };

  if (isLoading) {
    return (
      <>
        <Header title="savdolar" />
        <main className="align-elements py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="savdolar" />
      <main>
        <section>
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3.5 my-5 align-elements">
            <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                {faolCount}
              </div>
              <div className="text-[#7f8c8d] text-xs">Faol</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                {yakunlanganCount}
              </div>
              <div className="text-[#7f8c8d] text-xs">Yakunlangan</div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold mb-1 text-[#2c3e50]">
                {bekorQilinganCount}
              </div>
              <div className="text-[#7f8c8d] text-xs">Bekor qilingan</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="align-elements">
            <div className="flex my-5 bg-white rounded-2xl shadow-md p-1">
              {[
                { key: "faol", label: "Faol" },
                { key: "tarix", label: "Tarix" },
                { key: "hammasi", label: "Hammasi" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`flex-1 p-3 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 ease ${
                    filterType === tab.key
                      ? "bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white"
                      : "bg-transparent text-[#7f8c8d]"
                  }`}
                  onClick={() => setFilterType(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trades List */}
          <div className="align-elements pb-25">
            {/* Create New Trade Button */}
            <Link
              to="/savdolar/new"
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#04ebd8] to-[#00ff8c] text-white text-xl font-semibold p-4 mb-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus size={24} />
              Yangi savdo ochish
            </Link>

            {/* Trades */}
            {filteredTrades.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Savdolar topilmadi
                </h3>
                <p className="text-gray-600 mb-4">
                  Hozircha{" "}
                  {filterType === "faol"
                    ? "faol"
                    : filterType === "tarix"
                    ? "tugallangan"
                    : ""}{" "}
                  savdolaringiz yo'q
                </p>
                {filterType === "faol" && (
                  <Link
                    to="/savdolar/new"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Yangi savdo yaratish
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onComplete={handleTradeComplete}
                    onCancel={handleTradeCancel}
                    onDetails={openTradeDetails}
                    onShare={openShareModal}
                    isCompletingTrade={isCompletingTrade}
                    isCancelingTrade={isCancelingTrade}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      {showDetails && selectedTrade && (
        <SavdoDetails setView={setShowDetails} data={selectedTrade} />
      )}

      {showShare && selectedTrade && (
        <SavdoShare setShowShare={setShowShare} data={selectedTrade} />
      )}
    </>
  );
};

// Trade Card Component
const TradeCard = ({
  trade,
  onComplete,
  onCancel,
  onDetails,
  onShare,
  isCompletingTrade,
  isCancelingTrade,
}) => {
  const timeAgo = TimeAgo(trade.created_at);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md relative overflow-hidden">
      {/* Status Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          trade.status === "active"
            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
            : trade.status === "completed"
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : "bg-gradient-to-r from-red-500 to-red-600"
        }`}
      ></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold text-[#2c3e50]">#{trade.id}</div>
        <div
          className={`py-1.5 px-3 text-xs font-semibold rounded-2xl ${
            trade.status === "active"
              ? "bg-blue-50 text-blue-600"
              : trade.status === "completed"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {trade.status === "active"
            ? "Faol"
            : trade.status === "completed"
            ? "Yakunlangan"
            : "Bekor qilingan"}
        </div>
      </div>

      {/* Trade Info */}
      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <div className="text-[#2c3e50] text-base font-semibold mb-1">
            {trade.trade_name}
          </div>
          <div className="text-xs text-[#7f8c8d] mb-1 flex items-center gap-1">
            <User size={12} />
            {trade.creator_role === "seller" ? "Xaridor" : "Sotuvchi"}:{" "}
            {trade.partner_name || "Kutilmoqda..."}
          </div>
          <div className="text-xs text-[#95a5a6] flex items-center gap-1">
            <Clock size={12} />
            {timeAgo}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#2c3e50] mb-1 flex items-center gap-1">
            <DollarSign size={16} />
            {FormatNumber(trade.amount)} UZS
          </div>
          <div className="text-xs text-[#7f8c8d]">
            Komissiya: {FormatNumber(trade.commission_amount)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full ${
            trade.status === "active"
              ? trade.partner_id
                ? "w-3/4 bg-gradient-to-r from-blue-500 to-cyan-400"
                : "w-1/4 bg-gradient-to-r from-blue-500 to-cyan-400"
              : trade.status === "completed"
              ? "w-full bg-gradient-to-r from-green-500 to-green-600"
              : "w-1/4 bg-gradient-to-r from-red-500 to-red-600"
          }`}
        ></div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={() => onDetails(trade)}
          className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs bg-gradient-to-br from-blue-500 to-cyan-400 text-white hover:shadow-lg transition-all duration-300"
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Tafsilotlar
        </button>

        {trade.status === "active" && !trade.partner_id && (
          <button
            onClick={() => onShare(trade)}
            className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300"
          >
            <Share2 className="w-4 h-4 inline mr-1" />
            Ulashish
          </button>
        )}

        {trade.status === "active" && trade.partner_id && (
          <>
            {trade.creator_role === "seller" && (
              <button
                onClick={() => onComplete(trade.id)}
                disabled={isCompletingTrade}
                className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs bg-gradient-to-br from-green-600 to-green-400 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isCompletingTrade ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-1"></div>
                ) : (
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                )}
                Tasdiqlash
              </button>
            )}
            <a
              href={
                trade.partner_name?.charAt(0) === "@"
                  ? `https://t.me/${trade.partner_name.slice(1)}`
                  : `tg://user?id=${trade.partner_name}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 text-center"
            >
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Aloqa
            </a>
          </>
        )}

        {trade.status === "active" && (
          <button
            onClick={() => onCancel(trade.id)}
            disabled={isCancelingTrade}
            className="py-2.5 px-4 rounded-lg font-semibold text-xs bg-gradient-to-br from-red-500 to-red-700 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isCancelingTrade ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-1"></div>
            ) : (
              <XCircle className="w-4 h-4 inline mr-1" />
            )}
            Bekor qilish
          </button>
        )}
      </div>
    </div>
  );
};
