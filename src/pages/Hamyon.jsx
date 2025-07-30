// src/pages/Hamyon.jsx (Updated with API integration)
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { formatCurrency, getTimeAgo } from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import { Toldirish } from "../components/Toldirish";
import { Chiqarish } from "../components/Chiqarish";
import { PaymentCard } from "../components/PaymentCard";
import {
  Eye,
  EyeOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from "lucide-react";

export const Hamyon = () => {
  const { action } = useParams();
  const { user, payments } = useAppContext();
  const [showAll, setShowAll] = useState(false);

  if (action === "toldirish") {
    return <Toldirish />;
  } else if (action === "chiqarish") {
    return <Chiqarish />;
  }

  if (!user.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const balance = user.user.balance;
  const hideBalance = user.user.settings?.balance_hide;
  const recentPayments = showAll
    ? payments.payments
    : payments.payments.slice(0, 3);

  const toggleBalanceVisibility = async () => {
    try {
      await user.updateSettings({ balance_hide: !hideBalance });
      hapticFeedback("light");
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <>
      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto">
          {/* Balance Card */}
          <div className="py-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-sm opacity-80">Asosiy hisob</span>
                </div>
                <button
                  onClick={toggleBalanceVisibility}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  {hideBalance ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold mb-1">
                  {hideBalance ? "••• •••" : formatCurrency(balance)}
                </div>
                <div className="text-sm opacity-80">UZS</div>
              </div>

              {/* Last Transaction */}
              {payments.payments.length > 0 && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="opacity-80">Oxirgi o'zgarish</div>
                  <div className="flex items-center space-x-1">
                    {payments.payments[0].type === "deposit" ||
                    payments.payments[0].type === "trade_earn" ? (
                      <TrendingUp className="w-4 h-4 text-green-300" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-300" />
                    )}
                    <span
                      className={`font-semibold ${
                        payments.payments[0].type === "deposit" ||
                        payments.payments[0].type === "trade_earn"
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {hideBalance
                        ? "••• •••"
                        : formatCurrency(payments.payments[0].amount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-3">
              <Link
                to="/hamyon/toldirish"
                onClick={() => hapticFeedback("light")}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center transform active:scale-95"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  To'ldirish
                </span>
              </Link>

              <Link
                to="/hamyon/chiqarish"
                onClick={() => hapticFeedback("light")}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center transform active:scale-95"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Chiqarish
                </span>
              </Link>

              <button
                onClick={() => hapticFeedback("light")}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center transform active:scale-95"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  O'tkazma
                </span>
              </button>

              <button
                onClick={() => hapticFeedback("light")}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center transform active:scale-95"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-2">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Hisobot
                </span>
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="py-4 pb-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Oxirgi operatsiyalar
              </h2>
              <button
                onClick={() => {
                  setShowAll(!showAll);
                  hapticFeedback("selection");
                }}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {showAll ? "Yashirish" : "Barchasi"}
              </button>
            </div>

            {payments.loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Operatsiyalar yo'q
                </h3>
                <p className="text-gray-600 mb-4">
                  Hali birorta operatsiya bajarilmagan
                </p>
                <Link
                  to="/hamyon/toldirish"
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Hisobni to'ldirish
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    hideBalance={hideBalance}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};
