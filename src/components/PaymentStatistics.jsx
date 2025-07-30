import React from "react";
import { FormatNumber } from "./FormatNumber";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const PaymentStatistics = ({ operations, hide }) => {
  // Statistikalarni hisoblash
  const calculateStats = () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let transactionCount = operations.length;

    operations.forEach((op) => {
      const opDate = new Date(
        op.time.replace(/(\d{4})\.(\d{2})\.(\d{2})/, "$1-$2-$3")
      );
      const amount = parseInt(op.value);

      // Umumiy
      if (op.status === "+savdo" || op.status === "hisobtoldirish") {
        totalIncome += amount;
      } else if (
        op.status === "-savdo" ||
        op.status === "komissiya" ||
        op.status === "otkazma"
      ) {
        totalExpense += amount;
      }

      // Oylik
      if (
        opDate.getMonth() === thisMonth &&
        opDate.getFullYear() === thisYear
      ) {
        if (op.status === "+savdo" || op.status === "hisobtoldirish") {
          monthlyIncome += amount;
        } else if (
          op.status === "-savdo" ||
          op.status === "komissiya" ||
          op.status === "otkazma"
        ) {
          monthlyExpense += amount;
        }
      }
    });

    const netBalance = totalIncome - totalExpense;
    const monthlyNet = monthlyIncome - monthlyExpense;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      monthlyIncome,
      monthlyExpense,
      monthlyNet,
      transactionCount,
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-4">
      {/* Asosiy statistika */}
      <div className="grid grid-cols-2 gap-4">
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
            {hide ? "••• •••" : `+${FormatNumber(stats.totalIncome)}`}
          </div>
          <div className="text-xs text-gray-500">UZS</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Xarajat</span>
            </div>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-lg font-bold text-gray-800">
            {hide ? "••• •••" : `-${FormatNumber(stats.totalExpense)}`}
          </div>
          <div className="text-xs text-gray-500">UZS</div>
        </div>
      </div>

      {/* Oylik statistika */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-800">Bu oy</span>
          </div>
          <div
            className={`text-sm font-medium ${
              stats.monthlyNet >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {hide
              ? "••• •••"
              : `${stats.monthlyNet >= 0 ? "+" : ""}${FormatNumber(
                  stats.monthlyNet
                )} UZS`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Daromad</div>
            <div className="text-lg font-bold text-green-600">
              {hide ? "••• •••" : `+${FormatNumber(stats.monthlyIncome)}`}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Xarajat</div>
            <div className="text-lg font-bold text-red-600">
              {hide ? "••• •••" : `-${FormatNumber(stats.monthlyExpense)}`}
            </div>
          </div>
        </div>
      </div>

      {/* Qo'shimcha ma'lumotlar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-800">
            {stats.transactionCount}
          </div>
          <div className="text-xs text-gray-500">Jami operatsiya</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-gray-800">
            {hide ? "••• •••" : FormatNumber(Math.abs(stats.netBalance))}
          </div>
          <div className="text-xs text-gray-500">Umumiy balans</div>
        </div>
      </div>
    </div>
  );
};
