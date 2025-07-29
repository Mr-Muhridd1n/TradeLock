// src/components/LoadingScreen.jsx
import React from "react";
import { useAppContext } from "../context/AppContext";

export const LoadingScreen = () => {
  const { isLoading } = useAppContext();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Trade Lock</h2>
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    </div>
  );
};
