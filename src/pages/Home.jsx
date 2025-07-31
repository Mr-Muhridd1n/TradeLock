// src/pages/Home.jsx
import React, { useState } from "react";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { useApi } from "../context/ApiContext";
import { Link } from "react-router-dom";
import { FaUserLock, FaWeixin, FaWpforms, FaRegListAlt } from "react-icons/fa";
import {
  Wallet,
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Minus,
} from "lucide-react";

export const Home = () => {
  const {
    user,
    balance,
    availableBalance,
    frozenBalance,
    trades,
    transactionStats,
    isLoading,
  } = useApi();

  const [balanceHidden, setBalanceHidden] = useState(false);

  const activeTrades =
    trades?.filter((trade) => trade.status === "active")?.length || 0;
  const completedTrades =
    trades?.filter((trade) => trade.status === "completed")?.length || 0;
  const totalTrades = trades?.length || 0;
  const successRate =
    totalTrades > 0 ? Math.round((completedTrades / totalTrades) * 100) : 0;

  if (isLoading) {
    return (
      <>
        <Header title="home" />
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
      <Header title="home" />
      <main>
        <section className="bg-[#f8f9fa] py-5 align-elements mb-20">
          {/* Balance Card */}
          <div className="bg-white mb-5 rounded-2xl p-6 shadow-md text-center relative overflow-hidden">
            <div className="absolute w-full left-0 right-0 top-1 h-1 bg-gradient-to-br from-[#4facfe] to-[#00f2fe]"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Assalomu alaykum, {user?.first_name || "Foydalanuvchi"}!
                  </h3>
                  <p className="text-sm text-gray-600">Sizning balansingiz</p>
                </div>
              </div>
              <button
                onClick={() => setBalanceHidden(!balanceHidden)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                {balanceHidden ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-[#7f8c8d] mb-4">Joriy Balans</div>
            <div className="text-3xl font-bold text-[#2c3e50] mt-2.5 mb-4">
              {balanceHidden ? "••• •••" : FormatNumber(balance)} UZS
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-600 mb-1">Mavjud</div>
                <div className="text-lg font-bold text-green-700">
                  {balanceHidden ? "••• •••" : FormatNumber(availableBalance)}{" "}
                  UZS
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-orange-600 mb-1">Muzlatilgan</div>
                <div className="text-lg font-bold text-orange-700">
                  {balanceHidden ? "••• •••" : FormatNumber(frozenBalance)} UZS
                </div>
              </div>
            </div>

            <div className="flex mt-5 gap-2.5">
              <Link
                to="/hamyon/toldirish"
                className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white flex-1 p-3 border-none rounded-xl font-semibold cursor-pointer transition-all duration-300 ease flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                To'ldirish
              </Link>
              <Link
                to="/hamyon/chiqarish"
                className="bg-[#f8f9fa] text-[#495057] border-2 border-[#e9ecef] flex-1 p-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 ease flex items-center justify-center gap-2"
              >
                <Minus size={16} />
                Chiqarish
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            <div className="bg-white p-5 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-[#2c3e50] mb-1.5">
                {activeTrades}
              </div>
              <div className="text-[12px] text-[#7f8c8d]">Faol Savdolar</div>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center shadow-md">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-[#2c3e50] mb-1.5">
                {successRate}%
              </div>
              <div className="text-[12px] text-[#7f8c8d]">Muvaffaqiyat</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-5">
            <Link
              to="/savdolar/new"
              className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 ease shadow-md hover:translate-y-0.5 hover:shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-gradient-to-r from-[#ff6b6b] to-[#ee5a52]">
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
              to="/savdolar"
              className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 ease shadow-md hover:translate-y-0.5 hover:shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-gradient-to-r from-[#4ecdc4] to-[#44a08d]">
                <FaWpforms />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#2c3e50] mb-1">
                  Savdolar Tarixi
                </h4>
                <div className="text-sm text-[#7f8c8d]">
                  {totalTrades} ta savdo amalga oshirilgan
                </div>
              </div>
              <div className="text-[#bdc3c7] text-lg">›</div>
            </Link>

            <Link
              to="/sozlamalar"
              className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 ease shadow-md hover:translate-y-0.5 hover:shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-gradient-to-r from-[#45b7d1] to-[#2980b9]">
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
              href="https://t.me/TradeLock_support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white mb-2.5 rounded-2xl transition-all duration-300 ease shadow-md hover:translate-y-0.5 hover:shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 text-lg text-white bg-gradient-to-r from-[#f093fb] to-[#f5576c]">
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

          {/* Recent Activity */}
          {transactionStats && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bu oylik statistika
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    +{FormatNumber(transactionStats.total_income || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Daromad</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    -{FormatNumber(transactionStats.total_expense || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Xarajat</div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};
