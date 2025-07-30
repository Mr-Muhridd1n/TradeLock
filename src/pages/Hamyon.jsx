// src/pages/Hamyon.jsx - Yangilangan versiya
import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { formatCurrency, getTimeAgo } from "../utils/formatters";
import { hapticFeedback } from "../utils/telegram";
import { Toldirish } from "../components/Toldirish";
import { Chiqarish } from "../components/Chiqarish";
import { PaymentCard } from "../components/PaymentCard";
import { SearchBar } from "../components/SearchBar";
import { FilterModal } from "../components/FilterModal";
import { EmptyState } from "../components/EmptyState";
import {
  BalanceCardSkeleton,
  ListSkeleton,
} from "../components/SkeletonLoaders";
import {
  Eye,
  EyeOff,
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Filter,
  BarChart3,
} from "lucide-react";

export const Hamyon = () => {
  const { action } = useParams();
  const { user, payments } = useAppContext();

  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    amountRange: { min: "", max: "" },
    paymentType: "all",
  });

  if (action === "toldirish") {
    return <Toldirish />;
  } else if (action === "chiqarish") {
    return <Chiqarish />;
  }

  if (!user.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BalanceCardSkeleton />
      </div>
    );
  }

  const balance = user.user.balance;
  const hideBalance = user.user.settings?.balance_hide;

  // Filter and search logic for payments
  const filteredPayments = useMemo(() => {
    let result = payments.payments;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (payment) =>
          payment.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          payment.reference
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          payment.card_number?.includes(searchQuery)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((payment) => payment.status === filters.status);
    }

    // Payment type filter
    if (filters.paymentType !== "all") {
      result = result.filter((payment) => payment.type === filters.paymentType);
    }

    // Amount range filter
    if (filters.amountRange.min) {
      result = result.filter(
        (payment) => payment.amount >= parseFloat(filters.amountRange.min)
      );
    }
    if (filters.amountRange.max) {
      result = result.filter(
        (payment) => payment.amount <= parseFloat(filters.amountRange.max)
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      if (filters.dateRange !== "all") {
        result = result.filter(
          (payment) => new Date(payment.created_at) >= filterDate
        );
      }
    }

    return showAll ? result : result.slice(0, 5);
  }, [payments.payments, showAll, searchQuery, filters]);

  const toggleBalanceVisibility = async () => {
    try {
      await user.updateSettings({ balance_hide: !hideBalance });
      hapticFeedback("light");
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery ||
    filters.status !== "all" ||
    filters.paymentType !== "all" ||
    filters.dateRange !== "all" ||
    filters.amountRange.min ||
    filters.amountRange.max;

  // Calculate statistics
  const stats = useMemo(() => {
    const allPayments = payments.payments;
    const thisMonth = allPayments.filter((p) => {
      const paymentDate = new Date(p.created_at);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    });

    const income = thisMonth
      .filter((p) => ["deposit", "trade_earn", "bonus"].includes(p.type))
      .reduce((sum, p) => sum + p.amount, 0);

    const expense = thisMonth
      .filter((p) => ["withdraw", "commission", "penalty"].includes(p.type))
      .reduce((sum, p) => sum + p.amount, 0);

    return { income, expense, transactions: thisMonth.length };
  }, [payments.payments]);

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

              {/* Monthly Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-300 font-semibold">
                    {hideBalance ? "•••" : formatCurrency(stats.income)}
                  </div>
                  <div className="opacity-80">Kirim</div>
                </div>
                <div className="text-center">
                  <div className="text-red-300 font-semibold">
                    {hideBalance ? "•••" : formatCurrency(stats.expense)}
                  </div>
                  <div className="opacity-80">Chiqim</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stats.transactions}</div>
                  <div className="opacity-80">Operatsiya</div>
                </div>
              </div>
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
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  Hisobot
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="py-4 space-y-3">
            <SearchBar
              placeholder="To'lovlarni qidirish..."
              onSearch={setSearchQuery}
              onClear={handleClearSearch}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilterModal(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  hasActiveFilters
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
                {hasActiveFilters && (
                  <span className="bg-white text-blue-500 text-xs px-2 py-1 rounded-full font-bold">
                    •
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowAll(!showAll);
                  hapticFeedback("selection");
                }}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                {showAll ? "Kamroq" : "Barchasi"}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Operatsiyalar tarixi
              </h2>
              {hasActiveFilters && (
                <div className="text-sm text-gray-600">
                  {filteredPayments.length} ta topildi
                </div>
              )}
            </div>

            {payments.loading ? (
              <ListSkeleton items={5} type="payment" />
            ) : filteredPayments.length === 0 ? (
              <EmptyState
                icon={hasActiveFilters ? "🔍" : "💳"}
                title={
                  hasActiveFilters
                    ? "Hech narsa topilmadi"
                    : "Operatsiyalar yo'q"
                }
                description={
                  hasActiveFilters
                    ? "Qidiruv yoki filter shartlariga mos operatsiya topilmadi"
                    : "Hali birorta operatsiya bajarilmagan"
                }
                actionText={
                  hasActiveFilters ? "Filterni tozalash" : "Hisobni to'ldirish"
                }
                actionLink={hasActiveFilters ? undefined : "/hamyon/toldirish"}
                onAction={
                  hasActiveFilters
                    ? () => {
                        setFilters({
                          status: "all",
                          dateRange: "all",
                          amountRange: { min: "", max: "" },
                          paymentType: "all",
                        });
                        setSearchQuery("");
                      }
                    : undefined
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((payment) => (
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        filterType="payments"
        initialFilters={filters}
      />
    </>
  );
};
