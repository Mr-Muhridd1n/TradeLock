// src/pages/Hamyon.jsx
import React, { useState } from "react";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { useApi } from "../context/ApiContext";
import { useParams, Link } from "react-router-dom";
import { Toldirish } from "../components/Toldirish";
import { Chiqarish } from "../components/Chiqarish";
import {
  Eye,
  EyeOff,
  Wallet,
  Plus,
  Minus,
  Send,
  BarChart3,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Activity,
  DollarSign,
} from "lucide-react";

export const Hamyon = () => {
  const { balance, availableBalance, frozenBalance, transactions, isLoading } =
    useApi();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [activeTab, setActiveTab] = useState("operations");
  const { status } = useParams();

  if (status === "toldirish") {
    return <Toldirish />;
  } else if (status === "chiqarish") {
    return <Chiqarish />;
  }

  if (isLoading) {
    return (
      <>
        <Header title="hamyon" />
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
      <Header title="hamyon" />
      <main>
        <section className="align-elements">
          {/* Balans kartasi */}
          <div className="py-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm opacity-90 block">
                        Asosiy hisob
                      </span>
                      <span className="text-xs opacity-75">
                        TradeLock Wallet
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-3 bg-white bg-opacity-30 rounded-xl hover:bg-opacity-40 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                    onClick={() => setBalanceHidden(!balanceHidden)}
                  >
                    {balanceHidden ? (
                      <Eye className="w-5 h-5 text-white" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2">
                    {balanceHidden ? "••• ••• •••" : FormatNumber(balance)} UZS
                  </div>
                  <div className="text-sm opacity-90">Joriy balans</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Mavjud</div>
                    <div className="font-semibold">
                      {balanceHidden
                        ? "••• •••"
                        : FormatNumber(availableBalance)}{" "}
                      UZS
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Muzlatilgan</div>
                    <div className="font-semibold">
                      {balanceHidden ? "••• •••" : FormatNumber(frozenBalance)}{" "}
                      UZS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tezkor harakatlar */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-3">
              <Link
                to="/hamyon/toldirish"
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex items-center flex-col cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  To'ldirish
                </span>
              </Link>

              <Link
                to="/hamyon/chiqarish"
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex items-center flex-col cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Minus className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Chiqarish
                </span>
              </Link>

              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex items-center flex-col cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  O'tkazma
                </span>
              </button>

              <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex items-center flex-col cursor-pointer group">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Hisobot
                </span>
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="py-4">
            <div className="flex bg-white rounded-2xl shadow-md p-1">
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "operations"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("operations")}
              >
                <CreditCard className="w-4 h-4" />
                Operatsiyalar
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "statistics"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("statistics")}
              >
                <TrendingUp className="w-4 h-4" />
                Statistika
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="pb-20">
            {activeTab === "operations" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Oxirgi operatsiyalar
                  </h2>
                </div>

                <div className="space-y-3">
                  {transactions && transactions.length > 0 ? (
                    transactions
                      .slice(0, 10)
                      .map((transaction) => (
                        <TransactionCard
                          key={transaction.id}
                          transaction={transaction}
                          balanceHidden={balanceHidden}
                        />
                      ))
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Hozircha operatsiyalar yo'q
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "statistics" && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Moliyaviy statistika
                  </h2>
                  <p className="text-sm text-gray-600">
                    Sizning daromad va xarajatlaringiz haqida ma'lumot
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Daromad</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {balanceHidden ? "••• •••" : "+0"}
                    </div>
                    <div className="text-xs text-gray-500">UZS</div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm text-gray-600">Xarajat</span>
                      </div>
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {balanceHidden ? "••• •••" : "-0"}
                    </div>
                    <div className="text-xs text-gray-500">UZS</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3">Bu oy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Daromad</div>
                      <div className="text-lg font-bold text-green-600">
                        {balanceHidden ? "••• •••" : "+0"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Xarajat</div>
                      <div className="text-lg font-bold text-red-600">
                        {balanceHidden ? "••• •••" : "-0"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

// Transaction Card Component
const TransactionCard = ({ transaction, balanceHidden }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-5 h-5 text-white" />;
      case "withdrawal":
        return <Minus className="w-5 h-5 text-white" />;
      case "trade_release":
        return <DollarSign className="w-5 h-5 text-white" />;
      default:
        return <Activity className="w-5 h-5 text-white" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "deposit":
        return "bg-green-500";
      case "withdrawal":
        return "bg-red-500";
      case "trade_release":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTransactionText = (type) => {
    switch (type) {
      case "deposit":
        return "Hisob to'ldirish";
      case "withdrawal":
        return "Pul yechish";
      case "trade_release":
        return "Savdo to'lovi";
      default:
        return "Operatsiya";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${getTransactionColor(
              transaction.type
            )} rounded-full flex items-center justify-center`}
          >
            {getTransactionIcon(transaction.type)}
          </div>
          <div>
            <div className="font-semibold text-gray-800">
              {getTransactionText(transaction.type)}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(transaction.created_at).toLocaleDateString("uz-UZ")}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-bold ${
              transaction.amount > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {balanceHidden
              ? "••• •••"
              : `${transaction.amount > 0 ? "+" : ""}${FormatNumber(
                  Math.abs(transaction.amount)
                )}`}
          </div>
          <div className="text-sm text-gray-500">UZS</div>
        </div>
      </div>
    </div>
  );
};
