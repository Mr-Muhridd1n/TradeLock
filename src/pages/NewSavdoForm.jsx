import React, { useState } from "react";
import { Header } from "../components/Header";
import { FormatNumber } from "../components/FormatNumber";
import { NavLink, useNavigate } from "react-router-dom";
import { useMainGlobalContext } from "../hooks/useMainGlobalContext";
import {
  AlertTriangle,
  Copy,
  CheckCircle,
  DollarSign,
  ShoppingBag,
  Users,
  Percent,
  Info,
  ArrowRight,
  X,
} from "lucide-react";

export const NewSavdoForm = () => {
  const { result, dispatch } = useMainGlobalContext();
  const navigate = useNavigate();

  const [type, setType] = useState("sotish");
  const [savdoSummasi, setSavdoSummasi] = useState("");
  const [savdoKomissiyasi, setSavdoKomissiyasi] = useState("men");
  const [savdoName, setSavdoName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!savdoSummasi || parseInt(savdoSummasi) < 1000) {
      newErrors.amount = "Minimal savdo summasi 1,000 so'm";
    }

    if (!savdoName || savdoName.length < 3) {
      newErrors.name = "Savdo nomi kamida 3 ta belgi bo'lishi kerak";
    }

    // Balans tekshirish
    const requiredBalance = calculateRequiredBalance();
    if (result.Balance < requiredBalance) {
      newErrors.balance = `Savdo yaratish uchun ${FormatNumber(
        requiredBalance
      )} so'm balans kerak`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRequiredBalance = () => {
    const commission = (parseInt(savdoSummasi) || 0) * 0.02;

    if (type === "sotib_olish") {
      // Oluvchi: savdo summasi + komissiya (agar o'zi to'lasa)
      if (savdoKomissiyasi === "men") {
        return parseInt(savdoSummasi) + commission;
      }
      return parseInt(savdoSummasi);
    } else {
      // Sotuvchi: faqat komissiya (agar o'zi to'lasa)
      if (savdoKomissiyasi === "men") {
        return commission;
      }
      return 0;
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const createSavdo = () => {
    if (!validateForm()) {
      return;
    }

    const newSavdo = {
      id: Date.now(),
      status: type === "sotish" ? "sotuvchi" : "oluvchi",
      holat: "faol",
      user_target: null,
      navbat: type === "sotish" ? false : true,
      time: formatDate(new Date()),
      value: savdoSummasi.replace(/\s/g, ""),
      komissiya: savdoKomissiyasi,
      komissiyaValue: Math.floor(
        (parseInt(savdoSummasi.replace(/\s/g, "")) || 0) * 0.02
      ),
      active: true,
      savdoName: savdoName || "Nomalum savdo",
    };

    dispatch({
      type: "NEWSAVDO",
      payload: newSavdo,
    });

    setShowModal(true);
  };

  const savdoHavola = `tradelock_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  return (
    <>
      <Header title={"new_savdolar"} />
      <main className="min-h-screen bg-gray-50">
        <section className="align-elements py-6">
          {/* Savdo turi */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Savdo turi
                </h3>
                <p className="text-sm text-gray-600">Nima qilmoqchisiz?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  type === "sotish"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setType("sotish")}
              >
                <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Sotmoqchi</div>
                <div className="text-xs opacity-75">Mahsulot sotish</div>
              </button>

              <button
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  type === "sotib_olish"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setType("sotib_olish")}
              >
                <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Sotib olmoqchi</div>
                <div className="text-xs opacity-75">Mahsulot sotib olish</div>
              </button>
            </div>
          </div>

          {/* Savdo summasi */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Savdo summasi
                </h3>
                <p className="text-sm text-gray-600">
                  Mahsulot narxini kiriting
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={
                  savdoSummasi >= 1000
                    ? FormatNumber(savdoSummasi)
                    : savdoSummasi
                }
                placeholder="Savdo summasini kiriting"
                className={`w-full p-4 text-xl font-semibold border-2 rounded-xl bg-gray-50 transition-all duration-300 outline-none ${
                  errors.amount
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-800 focus:border-blue-500 focus:bg-white"
                }`}
                onInput={(e) => {
                  const filteredValue = e.target.value.replace(/[^0-9]/g, "");
                  setSavdoSummasi(filteredValue.replace(/^0+/, ""));
                  if (errors.amount) {
                    setErrors({ ...errors, amount: null });
                  }
                }}
              />
              <div className="absolute right-4 top-4 text-xl font-semibold text-gray-500">
                UZS
              </div>
            </div>

            {errors.amount && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {errors.amount}
              </div>
            )}

            {savdoSummasi && !errors.amount && (
              <div className="mt-2 text-sm text-gray-600">
                Savdo summasi: {FormatNumber(savdoSummasi)} UZS
              </div>
            )}
          </div>

          {/* Komissiya */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Percent className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Komissiya to'lovi
                </h3>
                <p className="text-sm text-gray-600">
                  Kim komissiya to'laydi? (2%)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                  savdoKomissiyasi === "men"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setSavdoKomissiyasi("men")}
              >
                Men to'layman
              </button>

              <button
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                  savdoKomissiyasi === "ortada"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setSavdoKomissiyasi("ortada")}
              >
                Ortada
              </button>

              <button
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                  savdoKomissiyasi === "undan"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => setSavdoKomissiyasi("undan")}
              >
                {type === "sotish" ? "Oluvchi to'laydi" : "Sotuvchi to'laydi"}
              </button>
            </div>
          </div>

          {/* Savdo nomi */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Savdo nomi
                </h3>
                <p className="text-sm text-gray-600">
                  Mahsulot haqida qisqacha
                </p>
              </div>
            </div>

            <input
              type="text"
              value={savdoName}
              placeholder="Masalan: iPhone 15 Pro Max"
              maxLength="25"
              className={`w-full p-4 border-2 rounded-xl bg-gray-50 transition-all duration-300 outline-none ${
                errors.name
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-800 focus:border-blue-500 focus:bg-white"
              }`}
              onInput={(e) => {
                const value = e.target.value || "";
                const cleanValue = value.replace(/[\\"'`;]|--|\/\*/g, "");
                setSavdoName(cleanValue);
                if (errors.name) {
                  setErrors({ ...errors, name: null });
                }
              }}
            />

            {errors.name && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {errors.name}
              </div>
            )}

            <div className="mt-2 text-sm text-gray-500">
              {savdoName.length}/25 belgi
            </div>
          </div>

          {/* Xulosa */}
          {savdoSummasi && savdoName && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Savdo xulosasi
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Mahsulot:</span>
                  <span className="font-semibold text-gray-800">
                    {savdoName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Summa:</span>
                  <span className="font-semibold text-gray-800">
                    {FormatNumber(savdoSummasi)} UZS
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Komissiya:</span>
                  <span className="font-semibold text-gray-800">
                    {savdoKomissiyasi === "men"
                      ? "Sizdan"
                      : savdoKomissiyasi === "ortada"
                      ? "Ortada"
                      : type === "sotish"
                      ? "Oluvchi to'laydi"
                      : "Sotuvchi to'laydi"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Komissiya summasi:</span>
                  <span className="font-semibold text-gray-800">
                    {FormatNumber(
                      Math.floor(
                        (parseInt(savdoSummasi.replace(/\s/g, "")) || 0) * 0.02
                      )
                    )}{" "}
                    UZS
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">
                    {type === "sotish"
                      ? "Siz qabul qilasiz:"
                      : "Siz to'laysiz:"}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      type === "sotish" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {FormatNumber(calculateRequiredBalance())} UZS
                  </span>
                </div>
              </div>
            </div>
          )}

          {errors.balance && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-800">
                    Balans yetarli emas
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {errors.balance}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tugmalar */}
          <div className="flex gap-4 pb-20">
            <NavLink
              to="/savdolar"
              className="flex-1 py-4 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Bekor qilish
            </NavLink>

            <button
              onClick={createSavdo}
              disabled={
                !savdoSummasi || !savdoName || parseInt(savdoSummasi) < 1000
              }
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                savdoSummasi && savdoName && parseInt(savdoSummasi) >= 1000
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="w-5 h-5" />
              Savdoni yaratish
            </button>
          </div>
        </section>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Savdo yaratildi!
                    </h2>
                    <p className="text-green-100 text-sm">
                      Muvaffaqiyatli amalga oshirildi
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Savdo ID:</span>
                    <span className="font-semibold">#{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mahsulot:</span>
                    <span className="font-semibold">{savdoName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Summa:</span>
                    <span className="font-semibold">
                      {FormatNumber(savdoSummasi)} UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mahfiy kod:</span>
                    <span className="font-mono font-semibold text-blue-600">
                      {/* Yaratilgan savdo mahfiy kodini ko'rsatish */}
                      TL{Date.now().toString(36)}
                      {Math.random().toString(36).substring(2, 6).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Keyingi qadamlar:
                    </span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1 ml-7">
                    <li>• "Savdolarni ko'rish" ga o'ting</li>
                    <li>• Yaratilgan savdoni toping</li>
                    <li>• "Ulashish" tugmasini bosing</li>
                    <li>• Mahfiy kodni yoki havolani ulashing</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/savdolar");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Savdolarni ko'rish
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
