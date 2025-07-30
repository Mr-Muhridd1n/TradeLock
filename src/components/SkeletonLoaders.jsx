// src/components/SkeletonLoaders.jsx
import React from "react";

// Base Skeleton component
export const Skeleton = ({ className = "", width, height }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] rounded ${className}`}
      style={style}
    />
  );
};

// Card Skeleton
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
};

// Trade Card Skeleton
export const TradeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      <div className="space-y-3 mb-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center space-x-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <div className="text-right">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-3 w-28" />
      </div>

      <Skeleton className="w-full h-2 rounded-full mb-4" />

      <div className="flex gap-2">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="flex-1 h-12 rounded-xl" />
      </div>
    </div>
  );
};

// Payment Card Skeleton
export const PaymentCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-5 w-20 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};

// Balance Card Skeleton
export const BalanceCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-10 h-10 rounded-full bg-white bg-opacity-20" />
          <Skeleton className="h-4 w-20 bg-white bg-opacity-20" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full bg-white bg-opacity-20" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-8 w-40 bg-white bg-opacity-20 mb-1" />
        <Skeleton className="h-4 w-12 bg-white bg-opacity-20" />
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24 bg-white bg-opacity-20" />
        <div className="flex items-center space-x-1">
          <Skeleton className="w-4 h-4 bg-white bg-opacity-20" />
          <Skeleton className="h-4 w-20 bg-white bg-opacity-20" />
        </div>
      </div>
    </div>
  );
};

// Stats Grid Skeleton
export const StatsGridSkeleton = ({ cols = 3 }) => {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: cols }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-2xl text-center shadow-md"
        >
          <Skeleton className="h-8 w-12 mx-auto mb-2" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
};

// List Skeleton
export const ListSkeleton = ({ items = 3, type = "card" }) => {
  const SkeletonComponent =
    type === "payment"
      ? PaymentCardSkeleton
      : type === "trade"
        ? TradeCardSkeleton
        : CardSkeleton;

  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-l-4 border-blue-500">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
};
