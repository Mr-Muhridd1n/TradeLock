import React from "react";
import { FormatNumber } from "./FormatNumber";
import {
  CheckCircle,
  AlertTriangle,
  X,
  DollarSign,
  User,
  Percent,
  Receipt,
} from "lucide-react";

export const BekorQilish = ({ setView_b, data }) => {
  const tasdiqlashBTN = (e) => {
    setView_b(null);
  };
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setView_b(null)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 relative">
          <button
            onClick={() => setView_b(null)}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Receipt className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Savdo Ma'lumoti</h2>
              <p className="text-blue-100 text-sm">
                {data.savdoName ? data.savdoName : "Tasdiqlash uchun"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sale Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Savdo summasi</p>
                  <p className="text-lg font-bold text-gray-900">
                    {FormatNumber(data.value)} so'm
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kim bilan</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.user_target}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="text-orange-500" size={16} />
                  <p className="text-sm text-gray-600">Komissiya</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {data.komissiya == "men"
                    ? "Siz tomoningizdan"
                    : data.komissiya == "ortada"
                    ? "Ortada"
                    : data.status == "oluvchi"
                    ? "Sotuvchi tomonidan"
                    : "Oluvchi tomonidan"}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-purple-500" size={16} />
                  <p className="text-sm text-gray-600">Komissiya summasi</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {FormatNumber(data.komissiyaValue)} so'm
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-amber-500 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Eslatma:</h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Bu savdoni bekor qilishni ortga qaytarib bo'lmaydi. Barcha
                  ma'lumotlarni tekshirib, Bekor qilishga rozimisiz?
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 
                           bg-gradient-to-r from-green-600 to-green-500 text-white 
                           hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:scale-105
                           active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              onClick={tasdiqlashBTN}
            >
              <CheckCircle size={18} />
              Tasdiqlash
            </button>
            <button
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
                           bg-gradient-to-r from-red-600 to-red-500 text-white 
                           hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:scale-105
                           active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => setView_b(false)}
            >
              <X size={18} />
              Ortga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
