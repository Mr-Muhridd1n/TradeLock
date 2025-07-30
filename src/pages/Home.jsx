// src/pages/Home.jsx (Updated)
import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { formatCurrency } from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import { FaUserLock, FaWeixin, FaRegListAlt, FaWpforms } from "react-icons/fa";

export const Home = () => {
  const { user, trades, isLoading } = useAppContext();

  if (isLoading || !user.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const stats = user.user.stats;
  const balance = user.user.balance;

  return (
    <>
      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto py-5">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center relative overflow-hidden mb-5">
            <div className="absolute w-full left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#4facfe] to-[#00f2fe]"></div>

            <div className="text-[#7f8c8d] mb-4 text-sm">Joriy Balans</div>
            <div className="text-3xl font-bold text-[#2c3e50] mb-4">
              {user.user.settings?.balance_hide
                ? "••• •••"
                : formatCurrency(balance)}
            </div>

            <div className="flex gap-3">
              <Link
                to="/hamyon/toldirish"
                onClick={() => hapticFeedback("light")}
                className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white flex-1 py-3 px-4 rounded-xl font-semibold text-center hover:shadow-lg transition-all transform active:scale-95"
              >
                To'ldirish
              </Link>
              <Link
                to="/hamyon/chiqarish"
                onClick={() => hapticFeedback("light")}
                className="bg-[#f8f9fa] text-[#495057] border-2 border-[#e9ecef] flex-1 py-3 px-4 rounded-xl font-semibold text-center hover:bg-gray-50 transition-colors"
              >
                Chiqarish
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl text-center shadow-md">
              <div className="text-2xl font-bold text-[#2c3e50] mb-2">
                {stats?.active_trades || 0}
              </div>
              <div className="text-xs text-[#7f8c8d]">Faol Savdolar</div>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center shadow-md">
              <div className="text-2xl font-bold text-[#2c3e50] mb-2">
                {stats?.success_rate || 0}%
              </div>
              <div className="text-xs text-[#7f8c8d]">Muvaffaqiyat</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link
              className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              to="/savdolar/new"
              onClick={() => hapticFeedback("medium")}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-lg text-white bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52]">
                <FaRegListAlt />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                  Yangi Savdo
                </h4>
                <div className="text-sm text-[#7f8c8d]">
                  Xavfsiz sotish/sotib olish
                </div>
              </div>
              <div className="text-[#bdc3c7] text-lg">›</div>
            </Link>

            <Link
              className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              to="/savdolar"
              onClick={() => hapticFeedback("light")}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-lg text-white bg-gradient-to-r from-[#4ecdc4] to-[#44a08d]">
                <FaWpforms />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                  Savdolar Tarixi
                </h4>
                <div className="text-sm text-[#7f8c8d]">
                  Barcha tranzaksiyalar
                </div>
              </div>
              <div className="text-[#bdc3c7] text-lg">›</div>
            </Link>

            <Link
              className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              to="/sozlamalar"
              onClick={() => hapticFeedback("light")}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-lg text-white bg-gradient-to-r from-[#45b7d1] to-[#2980b9]">
                <FaUserLock />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                  Xavfsizlik
                </h4>
                <div className="text-sm text-[#7f8c8d]">Himoya sozlamalari</div>
              </div>
              <div className="text-[#bdc3c7] text-lg">›</div>
            </Link>

            <a
              className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              href="https://t.me/TradeLock_support"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => hapticFeedback("light")}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-lg text-white bg-gradient-to-r from-[#f093fb] to-[#f5576c]">
                <FaWeixin />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                  Yordam
                </h4>
                <div className="text-sm text-[#7f8c8d]">
                  24/7 qo'llab-quvvatlash
                </div>
              </div>
              <div className="text-[#bdc3c7] text-lg">›</div>
            </a>
          </div>
        </section>
      </main>
    </>
  );
};
