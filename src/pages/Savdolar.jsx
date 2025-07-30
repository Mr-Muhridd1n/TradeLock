// src/pages/Savdolar.jsx - To'liq versiya
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
import {
  AlertTriangle,
  Copy,
  CheckCircle,
  Filter,
  Plus,
  ArrowLeft,
  DollarSign,
  Percent,
  User,
  X,
} from "lucide-react";

export const Savdolar = () => {
  const { action } = useParams();
  const navigate = useNavigate();
  const { trades, user, handleError, showSuccess } = useAppContext();

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  // New Trade Form Component
  if (action === "new") {
    const commissionAmount = formData.amount
      ? (parseFloat(formData.amount) * 2) / 100
      : 0;

    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => navigate("/savdolar")}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Yangi Savdo Yaratish</h1>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Trade Type Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Savdo turi
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    handleFormChange("trade_type", "sell");
                    hapticFeedback("selection");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.trade_type === "sell"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-semibold text-gray-800">Sotish</div>
                    <div className="text-sm text-gray-500">Men sotuvchiman</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleFormChange("trade_type", "buy");
                    hapticFeedback("selection");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.trade_type === "buy"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-semibold text-gray-800">
                      Sotib olish
                    </div>
                    <div className="text-sm text-gray-500">Men xaridorman</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Trade Name */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Savdo nomi
              </h3>
              <input
                type="text"
                value={formData.trade_name}
                onChange={(e) => handleFormChange("trade_name", e.target.value)}
                placeholder="Masalan: iPhone 15 Pro Max 256GB"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-2">
                Nima sotmoqchi yoki sotib olmoqchisiz?
              </p>
            </div>

            {/* Amount */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Savdo summasi
              </h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9]/g, "");
                    handleFormChange("amount", cleanValue);
                  }}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {formData.amount && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">
                    Formatli ko'rinish:
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </p>
                </div>
              )}
            </div>

            {/* Commission */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <Percent className="inline w-5 h-5 mr-2" />
                Komissiya (2%)
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleFormChange("commission_type", "creator");
                    hapticFeedback("selection");
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.commission_type === "creator"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    Men to'layman
                  </div>
                  <div className="text-sm text-gray-500">
                    Komissiyani o'zim to'layman (
                    {formatCurrency(commissionAmount)})
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleFormChange("commission_type", "participant");
                    hapticFeedback("selection");
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.commission_type === "participant"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {formData.trade_type === "sell" ? "Xaridor" : "Sotuvchi"}{" "}
                    to'laydi
                  </div>
                  <div className="text-sm text-gray-500">
                    Ikkinchi tomon komissiyani to'laydi (
                    {formatCurrency(commissionAmount)})
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleFormChange("commission_type", "split");
                    hapticFeedback("selection");
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.commission_type === "split"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    Teng taqsimlash
                  </div>
                  <div className="text-sm text-gray-500">
                    Har biri {formatCurrency(commissionAmount / 2)} to'laydi
                  </div>
                </button>
              </div>
            </div>

            {/* Balance Warning */}
            {formData.commission_type === "creator" && commissionAmount > 0 && (
              <div
                className={`rounded-xl p-4 ${
                  user.user.balance >= commissionAmount
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {user.user.balance >= commissionAmount ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h4
                      className={`font-semibold mb-1 ${
                        user.user.balance >= commissionAmount
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Balans holati
                    </h4>
                    <p
                      className={`text-sm ${
                        user.user.balance >= commissionAmount
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Sizning balansingiz: {formatCurrency(user.user.balance)}
                      <br />
                      Kerakli komissiya: {formatCurrency(commissionAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Create Button */}
            <div className="pb-6">
              <button
                onClick={handleCreateTrade}
                disabled={
                  isCreating || !formData.trade_name || !formData.amount
                }
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all transform active:scale-95"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Yaratilmoqda...
                  </div>
                ) : (
                  "Savdo Yaratish"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && createdTrade && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Savdo yaratildi!
                      </h2>
                      <p className="text-green-700 text-sm">
                        Muvaffaqiyatli yaratildi
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate("/savdolar");
                    }}
                    className="p-2 hover:bg-green-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {createdTrade.trade_name}
                  </h3>
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {formatCurrency(createdTrade.amount)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Savdo havolasi:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={createdTrade.share_url}
                      readOnly
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdTrade.share_url);
                        hapticFeedback("light");
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleShareTrade}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Ulashish
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      navigate("/savdolar");
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
