// src/components/FilterModal.jsx
import React, { useState } from "react";
import { X, Filter, Calendar, DollarSign, User } from "lucide-react";
import { hapticFeedback } from "../utils/telegram";
import { formatCurrency } from "../utils/formatters";

export const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  filterType = "trades", // "trades" or "payments"
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || "all",
    dateRange: initialFilters.dateRange || "all",
    amountRange: initialFilters.amountRange || { min: "", max: "" },
    tradeType: initialFilters.tradeType || "all", // Only for trades
    paymentType: initialFilters.paymentType || "all", // Only for payments
    ...initialFilters,
  });

  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    hapticFeedback("selection");
  };

  const handleAmountChange = (type, value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setFilters((prev) => ({
      ...prev,
      amountRange: { ...prev.amountRange, [type]: cleanValue },
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
    hapticFeedback("medium");
  };

  const handleReset = () => {
    const resetFilters = {
      status: "all",
      dateRange: "all",
      amountRange: { min: "", max: "" },
      tradeType: "all",
      paymentType: "all",
    };
    setFilters(resetFilters);
    hapticFeedback("light");
  };

  const statusOptions =
    filterType === "trades"
      ? [
          { value: "all", label: "Barcha holatlar" },
          { value: "active", label: "Faol" },
          { value: "in_progress", label: "Jarayonda" },
          { value: "completed", label: "Yakunlangan" },
          { value: "cancelled", label: "Bekor qilingan" },
        ]
      : [
          { value: "all", label: "Barcha holatlar" },
          { value: "pending", label: "Kutilmoqda" },
          { value: "completed", label: "Yakunlangan" },
          { value: "failed", label: "Muvaffaqiyatsiz" },
        ];

  const dateRangeOptions = [
    { value: "all", label: "Barcha vaqt" },
    { value: "today", label: "Bugun" },
    { value: "week", label: "Bu hafta" },
    { value: "month", label: "Bu oy" },
    { value: "quarter", label: "Bu chorak" },
  ];

  const tradeTypeOptions = [
    { value: "all", label: "Barcha turlar" },
    { value: "sell", label: "Sotish" },
    { value: "buy", label: "Sotib olish" },
  ];

  const paymentTypeOptions = [
    { value: "all", label: "Barcha turlar" },
    { value: "deposit", label: "To'ldirish" },
    { value: "withdraw", label: "Chiqarish" },
    { value: "trade_earn", label: "Savdo daromadi" },
    { value: "commission", label: "Komissiya" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Filtrlash</h2>
              <p className="text-sm text-gray-500">
                {filterType === "trades" ? "Savdolarni" : "To'lovlarni"}{" "}
                filtrlang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Holat
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("status", option.value)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    filters.status === option.value
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="inline w-4 h-4 mr-2" />
              Vaqt oralig'i
            </label>
            <div className="grid grid-cols-1 gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("dateRange", option.value)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    filters.dateRange === option.value
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Summa oralig'i
            </label>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={filters.amountRange.min}
                  onChange={(e) => handleAmountChange("min", e.target.value)}
                  placeholder="Minimum"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {filters.amountRange.min && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(parseFloat(filters.amountRange.min))}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={filters.amountRange.max}
                  onChange={(e) => handleAmountChange("max", e.target.value)}
                  placeholder="Maksimum"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {filters.amountRange.max && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(parseFloat(filters.amountRange.max))}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Trade Type Filter (only for trades) */}
          {filterType === "trades" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <User className="inline w-4 h-4 mr-2" />
                Savdo turi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tradeTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange("tradeType", option.value)
                    }
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      filters.tradeType === option.value
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type Filter (only for payments) */}
          {filterType === "payments" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                To'lov turi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleFilterChange("paymentType", option.value)
                    }
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      filters.paymentType === option.value
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Tozalash
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Qo'llash
          </button>
        </div>
      </div>
    </div>
  );
};
