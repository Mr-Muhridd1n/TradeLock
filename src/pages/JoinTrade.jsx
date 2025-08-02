// src/pages/JoinTrade.jsx - Faqat Telegram WebApp uchun optimallashtirilgan
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import { FormatNumber } from "../components/FormatNumber";
import {
  CheckCircle,
  AlertTriangle,
  DollarSign,
  User,
  Clock,
  Shield,
  ArrowRight,
  X,
  Loader,
  ExternalLink,
  Copy,
  Share2,
} from "lucide-react";

export const JoinTrade = () => {
  const { secretCode: urlSecretCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    joinTrade,
    isJoiningTrade,
    availableBalance,
    getTradeByCode,
    isDevelopmentMode,
    isTelegramWebApp,
  } = useApi();

  const [tradeInfo, setTradeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actualSecretCode, setActualSecretCode] = useState(null);

  // Development mode da brauzer kirish ta'qiqi
  useEffect(() => {
    if (!isDevelopmentMode && !isTelegramWebApp) {
      console.error("Production mode: Faqat Telegram WebApp");
      setError("Bu ilova faqat Telegram WebApp orqali ishlaydi");
      setLoading(false);
      return;
    }
  }, [isDevelopmentMode, isTelegramWebApp]);

  // URL parametrlardan secret code ni olish
  useEffect(() => {
    if (!isDevelopmentMode && !isTelegramWebApp) {
      return; // Telegram WebApp emas bo'lsa, davom etmaslik
    }

    let codeToUse = null;

    // 1. URL path dan
    if (urlSecretCode) {
      codeToUse = urlSecretCode;
      console.log("Secret code from URL path:", codeToUse);
    }
    // 2. Query parametrdan
    else if (searchParams.get("trade")) {
      codeToUse = searchParams.get("trade");
      console.log("Secret code from query param 'trade':", codeToUse);
    } else if (searchParams.get("code")) {
      codeToUse = searchParams.get("code");
      console.log("Secret code from query param 'code':", codeToUse);
    } else if (searchParams.get("savdo")) {
      codeToUse = searchParams.get("savdo");
      console.log("Secret code from query param 'savdo':", codeToUse);
    }

    // 3. Telegram WebApp start_param dan (faqat production da)
    if (
      !isDevelopmentMode &&
      window.Telegram?.WebApp?.initDataUnsafe?.start_param
    ) {
      const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
      console.log("Telegram start_param:", startParam);

      if (startParam.startsWith("savdo_")) {
        codeToUse = startParam.replace("savdo_", "");
        console.log("Secret code from Telegram start_param:", codeToUse);
      } else if (startParam.startsWith("trade_")) {
        codeToUse = startParam.replace("trade_", "");
        console.log("Secret code from Telegram start_param:", codeToUse);
      } else {
        codeToUse = startParam;
        console.log("Direct secret code from Telegram start_param:", codeToUse);
      }
    }

    if (codeToUse) {
      setActualSecretCode(codeToUse);
      loadTradeInfo(codeToUse);
    } else {
      setError(
        "Savdo kodi topilmadi. URL yoki Telegram havolasida xatolik bo'lishi mumkin."
      );
      setLoading(false);
    }
  }, [urlSecretCode, searchParams, isDevelopmentMode, isTelegramWebApp]);

  const loadTradeInfo = async (secretCode) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading trade with secret code:", secretCode);
      const trade = await getTradeByCode(secretCode);

      if (!trade) {
        throw new Error("Savdo topilmadi yoki muddati tugagan");
      }

      if (trade.status !== "active") {
        throw new Error("Bu savdo faol emas");
      }

      if (trade.partner_id) {
        throw new Error("Bu savdoga allaqachon qo'shilgan");
      }

      setTradeInfo(trade);
    } catch (error) {
      console.error("Trade loading error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrade = async () => {
    try {
      await joinTrade(actualSecretCode);
      navigate("/savdolar");
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateRequiredAmount = () => {
    if (!tradeInfo) return 0;

    const { amount, commission_amount, commission_type, creator_role } =
      tradeInfo;
    const partnerRole = creator_role === "seller" ? "buyer" : "seller";

    if (partnerRole === "buyer") {
      switch (commission_type) {
        case "creator":
          return amount;
        case "partner":
          return amount + commission_amount;
        case "split":
          return amount + commission_amount / 2;
        default:
          return amount;
      }
    }
    return 0;
  };

  const getCommissionText = () => {
    if (!tradeInfo) return "";

    const { commission_type } = tradeInfo;

    switch (commission_type) {
      case "creator":
        return "Yaratuvchi to'laydi";
      case "partner":
        return "Siz to'laysiz";
      case "split":
        return "Ortada";
      default:
        return "";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Clipboard ga nusxalandi:", text);
    });
  };

  const shareUrl = () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "TradeLock Savdo Taklifi",
        text: `Sizga savdo taklifi: ${tradeInfo?.trade_name}`,
        url: currentUrl,
      });
    } else {
      copyToClipboard(currentUrl);
    }
  };

  // Production da Telegram WebApp emas bo'lsa
  if (!isDevelopmentMode && !isTelegramWebApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Noto'g'ri kirish
          </h2>
          <p className="text-gray-600 mb-4">
            Bu ilova faqat Telegram WebApp orqali ishlaydi
          </p>
          <a
            href="https://t.me/Trade_Lock_bot/app"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Telegram WebApp orqali ochish
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Brauzer orqali kirish mumkin emas
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Savdo ma'lumotlari yuklanmoqda...</p>
          {actualSecretCode && (
            <p className="text-sm text-gray-500 mt-2">
              Kod: {actualSecretCode}
            </p>
          )}
          {isDevelopmentMode && (
            <p className="text-xs text-orange-600 mt-2">Development Mode</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tradeInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Xatolik!</h2>
          <p className="text-gray-600 mb-6">{error || "Savdo topilmadi"}</p>

          {/* Development mode da debug info */}
          {isDevelopmentMode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">
                Debug ma'lumot:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Development Mode: {isDevelopmentMode ? "Ha" : "Yo'q"}</p>
                <p>Telegram WebApp: {isTelegramWebApp ? "Ha" : "Yo'q"}</p>
                <p>URL Secret Code: {urlSecretCode || "Yo'q"}</p>
                <p>Query 'trade': {searchParams.get("trade") || "Yo'q"}</p>
                <p>Query 'code': {searchParams.get("code") || "Yo'q"}</p>
                <p>Query 'savdo': {searchParams.get("savdo") || "Yo'q"}</p>
                <p>Ishlatilgan kod: {actualSecretCode || "Aniqlanmadi"}</p>
                <p>Current URL: {window.location.href}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Bosh sahifaga qaytish
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Qayta yuklash
            </button>

            {/* Production da Telegram havolasi */}
            {!isDevelopmentMode && (
              <a
                href="https://t.me/Trade_Lock_bot/app"
                className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Telegram WebApp orqali ochish
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const requiredAmount = calculateRequiredAmount();
  const hasEnoughBalance = availableBalance >= requiredAmount;
  const partnerRole = tradeInfo.creator_role === "seller" ? "buyer" : "seller";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold mb-1">Savdoga qo'shilish</h1>
          <p className="text-blue-100 text-sm">
            Savdo ma'lumotlarini ko'ring va qo'shiling
          </p>
          <div className="mt-2 text-xs text-blue-200">
            Kod: {actualSecretCode}
          </div>
          {isDevelopmentMode && (
            <div className="mt-1 text-xs text-yellow-200">
              🔧 Development Mode
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Share section - faqat development mode da */}
        {isDevelopmentMode && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Development mode
                </h3>
                <p className="text-sm text-gray-600">Demo savdo havolasi</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <Copy size={16} />
                  Nusxalash
                </button>
                <button
                  onClick={shareUrl}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  <Share2 size={16} />
                  Ulashish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trade Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Savdo ma'lumotlari
              </h2>
              <p className="text-sm text-gray-600">ID: #{tradeInfo.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mahsulot</p>
                  <p className="font-semibold text-gray-800">
                    {tradeInfo.trade_name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  {FormatNumber(tradeInfo.amount)} UZS
                </p>
                <p className="text-sm text-gray-500">Savdo summasi</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yaratuvchi</p>
                  <p className="font-semibold text-gray-800">
                    {tradeInfo.creator_name || "Demo User"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-700 capitalize">
                  {tradeInfo.creator_role === "seller" ? "Sotuvchi" : "Xaridor"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Sizning rolingiz</p>
                </div>
                <p className="font-semibold text-green-700 capitalize">
                  {partnerRole === "seller" ? "Sotuvchi" : "Xaridor"}
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <p className="text-sm text-gray-600">Komissiya</p>
                </div>
                <p className="font-semibold text-orange-700">
                  {getCommissionText()}
                </p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600">Komissiya summasi</p>
              </div>
              <p className="font-semibold text-purple-700">
                {FormatNumber(tradeInfo.commission_amount)} UZS
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {partnerRole === "buyer" && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              To'lov ma'lumotlari
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Mahsulot narxi:</span>
                <span className="font-semibold">
                  {FormatNumber(tradeInfo.amount)} UZS
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Komissiya:</span>
                <span className="font-semibold">
                  {FormatNumber(tradeInfo.commission_amount)} UZS (
                  {getCommissionText()})
                </span>
              </div>

              <div className="flex justify-between py-2 font-bold text-lg">
                <span className="text-gray-800">Jami to'lov:</span>
                <span className="text-blue-600">
                  {FormatNumber(requiredAmount)} UZS
                </span>
              </div>
            </div>

            {/* Balance Check */}
            <div
              className={`mt-4 p-4 rounded-xl ${
                hasEnoughBalance
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {hasEnoughBalance ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`font-semibold ${
                    hasEnoughBalance ? "text-green-800" : "text-red-800"
                  }`}
                >
                  Balans holati
                </span>
              </div>
              <p
                className={`text-sm ${
                  hasEnoughBalance ? "text-green-700" : "text-red-700"
                }`}
              >
                Sizning balansingiz: {FormatNumber(availableBalance)} UZS
                {!hasEnoughBalance && (
                  <span className="block mt-1">
                    Yetishmaydi:{" "}
                    {FormatNumber(requiredAmount - availableBalance)} UZS
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pb-20">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Bekor qilish
          </button>

          <button
            onClick={() => {
              if (partnerRole === "buyer" && !hasEnoughBalance) {
                return;
              }
              setShowConfirmation(true);
            }}
            disabled={
              isJoiningTrade || (partnerRole === "buyer" && !hasEnoughBalance)
            }
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              !isJoiningTrade && (partnerRole === "seller" || hasEnoughBalance)
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isJoiningTrade ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Savdoga qo'shilish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Tasdiqlash</h2>
                  <p className="text-green-100 text-sm">
                    Savdoga qo'shilishni tasdiqlang
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Muhim!</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Savdoga qo'shilganingizdan so'ng, siz{" "}
                  {partnerRole === "seller" ? "sotuvchi" : "xaridor"}
                  sifatida javobgar bo'lasiz. Barcha shartlarni o'qib
                  chiqdingizmi?
                </p>
              </div>

              {partnerRole === "buyer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-semibold">
                    Sizning balansingizdan {FormatNumber(requiredAmount)} UZS
                    muzlatiladi.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleJoinTrade}
                  disabled={isJoiningTrade}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {isJoiningTrade ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                  ) : (
                    "Tasdiqlash"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
