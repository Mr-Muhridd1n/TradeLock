// src/pages/Savdolar.jsx - Yangilangan versiya
import React, { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  formatCurrency,
  validateAmount,
  validateTradeName,
} from "../utils/formatters";
import { shareTradeLink, hapticFeedback, showConfirm } from "../utils/telegram";
import { TradeCard } from "../components/TradeCard";
import { SearchBar } from "../components/SearchBar";
import { FilterModal } from "../components/FilterModal";
import { EmptyState } from "../components/EmptyState";
import { ListSkeleton } from "../components/SkeletonLoaders";
import { AlertTriangle, Copy, CheckCircle, Filter, Plus } from "lucide-react";

export const Savdolar = () => {
  const { action } = useParams();
  const navigate = useNavigate();
  const { trades, user, handleError } = useAppContext();

  const [activeTab, setActiveTab] = useState("faol");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    amountRange: { min: "", max: "" },
    tradeType: "all",
  });

  // New trade form state
  const [formData, setFormData] = useState({
    trade_type: "sell",
    trade_name: "",
    amount: "",
    commission_type: "creator",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccessModal] = useState(false);
  const [createdTrade, setCreatedTrade] = useState(null);

  // Filter and search logic
  const filteredTrades = useMemo(() => {
    let result = trades.trades;

    // Tab filter
    if (activeTab === "faol") {
      result = result.filter((trade) =>
        ["active", "in_progress"].includes(trade.status)
      );
    } else if (activeTab === "tarix") {
      result = result.filter((trade) =>
        ["completed", "cancelled"].includes(trade.status)
      );
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (trade) =>
          trade.trade_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trade.creator_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          trade.participant_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((trade) => trade.status === filters.status);
    }

    // Trade type filter
    if (filters.tradeType !== "all") {
      result = result.filter((trade) => trade.trade_type === filters.tradeType);
    }

    // Amount range filter
    if (filters.amountRange.min) {
      result = result.filter(
        (trade) => trade.amount >= parseFloat(filters.amountRange.min)
      );
    }
    if (filters.amountRange.max) {
      result = result.filter(
        (trade) => trade.amount <= parseFloat(filters.amountRange.max)
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
          (trade) => new Date(trade.created_at) >= filterDate
        );
      }
    }

    return result;
  }, [trades.trades, activeTab, searchQuery, filters]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const amountError = validateAmount(formData.amount);
    if (amountError) {
      handleError(new Error(amountError));
      return false;
    }

    const nameError = validateTradeName(formData.trade_name);
    if (nameError) {
      handleError(new Error(nameError));
      return false;
    }

    if (formData.commission_type === "creator") {
      const commissionAmount = (parseFloat(formData.amount) * 2) / 100;
      if (user.user.balance < commissionAmount) {
        handleError(new Error("Komissiya uchun yetarli balans yo'q"));
        return false;
      }
    }

    return true;
  };

  const handleCreateTrade = async () => {
    if (!validateForm()) return;

    try {
      setIsCreating(true);
      hapticFeedback("medium");

      const result = await trades.createTrade({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      setCreatedTrade(result);
      setShowSuccessModal(true);
      hapticFeedback("success");
    } catch (error) {
      handleError(error);
      hapticFeedback("error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleShareTrade = () => {
    if (createdTrade?.share_url) {
      shareTradeLink(createdTrade.share_url);
      hapticFeedback("light");
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (action === "new") {
    return (
      <NewTradeForm
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleCreateTrade}
        isCreating={isCreating}
        showSuccessModal={showSuccess}
        createdTrade={createdTrade}
        onShare={handleShareTrade}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/savdolar");
        }}
      />
    );
  }

  const stats = {
    faol: trades.trades.filter((t) =>
      ["active", "in_progress"].includes(t.status)
    ).length,
    yakunlangan: trades.trades.filter((t) => t.status === "completed").length,
    bekor: trades.trades.filter((t) => t.status === "cancelled").length,
  };

  const hasActiveFilters =
    searchQuery ||
    filters.status !== "all" ||
    filters.tradeType !== "all" ||
    filters.dateRange !== "all" ||
    filters.amountRange.min ||
    filters.amountRange.max;

  return (
    <>
      <main className="bg-[#f8f9fa] min-h-screen">
        <section className="max-w-7xl px-4 mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-5">
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.faol}
              </div>
              <div className="text-xs text-[#7f8c8d]">Faol</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.yakunlangan}
              </div>
              <div className="text-xs text-[#7f8c8d]">Yakunlangan</div>
            </div>
            <div className="bg-white p-4 rounded-2xl text-center shadow-md">
              <div className="text-xl font-bold text-[#2c3e50] mb-1">
                {stats.bekor}
              </div>
              <div className="text-xs text-[#7f8c8d]">Bekor qilingan</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-5 space-y-3">
            <SearchBar
              placeholder="Savdolarni qidirish..."
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

              <Link
                to="/savdolar/new"
                onClick={() => hapticFeedback("medium")}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Yangi</span>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl shadow-md p-1 mb-5">
            {["faol", "tarix", "hammasi"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  hapticFeedback("selection");
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-white"
                    : "text-[#7f8c8d]"
                }`}
              >
                {tab === "faol"
                  ? "Faol"
                  : tab === "tarix"
                    ? "Tarix"
                    : "Hammasi"}
              </button>
            ))}
          </div>

          {/* Results count */}
          {hasActiveFilters && (
            <div className="mb-4 text-sm text-gray-600">
              {filteredTrades.length} ta savdo topildi
              {searchQuery && ` "${searchQuery}" uchun`}
            </div>
          )}

          {/* Trades List */}
          <div className="space-y-4 pb-6">
            {trades.loading ? (
              <ListSkeleton items={5} type="trade" />
            ) : filteredTrades.length === 0 ? (
              <EmptyState
                icon={hasActiveFilters ? "🔍" : "📝"}
                title={
                  hasActiveFilters ? "Hech narsa topilmadi" : "Savdolar yo'q"
                }
                description={
                  hasActiveFilters
                    ? "Qidiruv yoki filter shartlariga mos savdo topilmadi"
                    : "Hali birorta savdo yaratilmagan"
                }
                actionText={
                  hasActiveFilters
                    ? "Filterni tozalash"
                    : "Birinchi savdoni yarating"
                }
                actionLink={hasActiveFilters ? undefined : "/savdolar/new"}
                onAction={
                  hasActiveFilters
                    ? () => {
                        setFilters({
                          status: "all",
                          dateRange: "all",
                          amountRange: { min: "", max: "" },
                          tradeType: "all",
                        });
                        setSearchQuery("");
                      }
                    : undefined
                }
              />
            ) : (
              filteredTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        filterType="trades"
        initialFilters={filters}
      />
    </>
  );
};

// NewTradeForm component qolgan qismi oldingi kabi...
