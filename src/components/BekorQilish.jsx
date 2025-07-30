// src/components/BekorQilish.jsx
import React, { useState } from "react";
import { Tasdiqlash } from "./Tasdiqlash";
import { XCircle } from "lucide-react";

export const BekorQilish = ({ tradeId, onCancel, isOpen, onClose }) => {
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const reasons = [
    "Fikrimni o'zgartirdim",
    "Noto'g'ri summa kiritdim",
    "Boshqa shart-sharoitlar",
    "Savdogar javob bermaydi",
    "Maxfiy sabab",
  ];

  const handleSubmit = () => {
    if (!reason) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onCancel(tradeId, reason);
    setShowConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Savdoni Bekor Qilish
                </h2>
                <p className="text-red-700 text-sm">Sababi</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Savdoni bekor qilish sababini tanlang:
            </p>

            <div className="space-y-2 mb-6">
              {reasons.map((reasonOption) => (
                <label
                  key={reasonOption}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Yopish
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bekor Qilish
              </button>
            </div>
          </div>
        </div>
      </div>

      <Tasdiqlash
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Savdoni Bekor Qilish"
        message={`Savdoni "${reason}" sababi bilan bekor qilishni tasdiqlaysizmi?`}
        confirmText="Bekor Qilish"
        type="danger"
      />
    </>
  );
};
