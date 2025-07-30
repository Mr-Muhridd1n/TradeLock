import { useState } from "react";
import { Header } from "../components/Header";
import { Operation } from "../components/Operation";
import { FormatNumber } from "../components/FormatNumber";
import { PaymentStatistics } from "../components/PaymentStatistics";
import { Link, useParams } from "react-router-dom";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import { Toldirish } from "../components/Toldirish";
import { Chiqarish } from "../components/Chiqarish";
import { useTelegram } from "../hooks/useTelegram";
import { showToast } from "../utils/toast"; // toast kutubxonasi qo'shilgandan keyin
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
} from "lucide-react";

export const Hamyon = () => {
  const { result, dispatch } = useMainGlobalContext();
  const { getUserData } = useTelegram();
  const userData = getUserData();
  // const userData = null;
  const hide = result.user.setting.balance_hide;
  const [operation, setOperation] = useState("min");
  const [activeTab, setActiveTab] = useState("operations");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { status } = useParams();

  // O'tkazma funksiyasi
  const handleTransfer = () => {
    setShowTransferModal(true);
    // showToast.info("O'tkazma funksiyasi tez orada ishga tushadi!");
  };

  // Hisobot funksiyasi
  const handleReport = () => {
    setShowReportModal(true);
    // showToast.info("Hisobot funksiyasi tez orada ishga tushadi!");
  };

  if (status === "toldirish") {
    return <Toldirish />;
  } else if (status === "chiqarish") {
    return <Chiqarish />;
  } else {
    return (
      <>
        <Header title={"hamyon"} />
        <main>
          <section className="align-elements">
            {/* Balans kartasi */}
            <div className="py-4">
              <div className="balance-card rounded-2xl p-6 text-white card-hover relative z-10 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        {userData?.id && result.user.userImage ? (
                          <img
                            src={result.user.userImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
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
                      onClick={() =>
                        dispatch({
                          type: "SETHIDE",
                          payload: !hide,
                        })
                      }
                    >
                      {!hide ? (
                        <EyeOff className="w-5 h-5 text-white" />
                      ) : (
                        <Eye className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">
                      {hide ? "••• ••• •••" : FormatNumber(result.balance)}
                    </div>
                    <div className="text-sm opacity-90">UZS</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs opacity-75 mb-1">
                        Oxirgi o'zgarish
                      </div>
                      <div
                        className={`text-sm font-semibold flex items-center space-x-1 ${
                          (result &&
                            result.data.savdolar.length >= 1 &&
                            result.data.operation[0].status === "+savdo") ||
                          result.data.operation[0].status ===
                            "hisobtoldirish" ||
                          result.data.operation[0].status === "+otkazma"
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {result && result.data.operation.length >= 1 && (
                          <>
                            {result.data.operation[0].status === "+savdo" ||
                            result.data.operation[0].status ===
                              "hisobtoldirish" ||
                            result.data.operation[0].status === "+otkazma" ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span>
                              {hide
                                ? "••• •••"
                                : (result.data.operation[0].status ===
                                    "+savdo" ||
                                  result.data.operation[0].status ===
                                    "hisobtoldirish" ||
                                  result.data.operation[0].status === "+otkazma"
                                    ? "+"
                                    : "-") +
                                  FormatNumber(result.data.operation[0].value)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-75 mb-1">
                        Faol savdolar
                      </div>
                      <div className="text-sm font-semibold">
                        {
                          result.data.savdolar.filter((s) => s.holat === "faol")
                            .length
                        }
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
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer group"
                >
                  <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    To'ldirish
                  </span>
                </Link>

                <Link
                  to={"/hamyon/chiqarish"}
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer group"
                >
                  <div className="w-12 h-12 gradient-green rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Minus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Chiqarish
                  </span>
                </Link>

                <button
                  onClick={handleTransfer}
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer group"
                >
                  <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    O'tkazma
                  </span>
                </button>

                <button
                  onClick={handleReport}
                  className="bg-white rounded-xl p-4 shadow-sm card-hover text-center flex items-center flex-col cursor-pointer group"
                >
                  <div className="w-12 h-12 gradient-orange rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
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
                    <button
                      onClick={() => {
                        setOperation(operation === "min" ? "all" : "min");
                      }}
                      className="text-blue-500 text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      {operation !== "min" ? "Yashirish" : "Barchasi"}
                    </button>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {operation === "min"
                      ? result &&
                        result.data.operation.slice(0, 5).map((data) => {
                          return (
                            <Operation key={data.id} data={data} hide={hide} />
                          );
                        })
                      : result &&
                        result.data.operation.map((data) => {
                          return (
                            <Operation key={data.id} data={data} hide={hide} />
                          );
                        })}
                  </ul>
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

                  <PaymentStatistics
                    operations={result.data.operation}
                    hide={hide}
                  />
                </div>
              )}
            </div>
          </section>

          {/* O'tkazma Modal */}
          {showTransferModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  O'tkazma
                </h3>
                <p className="text-gray-600 mb-6">
                  O'tkazma funksiyasi tez orada ishga tushadi. Siz
                  do'stlaringizga pul o'tkazishingiz mumkin bo'ladi.
                </p>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Tushundim
                </button>
              </div>
            </div>
          )}

          {/* Hisobot Modal */}
          {showReportModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Hisobot
                </h3>
                <p className="text-gray-600 mb-6">
                  Batafsil hisobot funksiyasi tez orada ishga tushadi. Siz
                  to'liq moliyaviy hisobotingizni PDF shaklida yuklab olishingiz
                  mumkin bo'ladi.
                </p>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Tushundim
                </button>
              </div>
            </div>
          )}
        </main>
      </>
    );
  }
};
