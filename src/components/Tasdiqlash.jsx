// src/components/Tasdiqlash.jsx
import React from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export const Tasdiqlash = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Tasdiqlash",
  message = "Bu amalni bajarishni tasdiqlaysizmi?",
  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",
  type = "default", // default, warning, danger
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case "danger":
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return <CheckCircle className="w-16 h-16 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "warning":
        return "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700";
      case "danger":
        return "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";
      default:
        return "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all duration-300 scale-100">
        <div className="p-6 text-center">
          <div className="mb-4">{getIcon()}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 bg-gradient-to-r ${getColors()} text-white rounded-xl font-semibold transition-all`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
