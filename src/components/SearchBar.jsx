// src/components/SearchBar.jsx
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { hapticFeedback } from "../utils/telegram";

export const SearchBar = ({
  placeholder = "Qidirish...",
  onSearch,
  onClear,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch("");
    }
    hapticFeedback("light");
  };

  const handleFocus = () => {
    setIsFocused(true);
    hapticFeedback("selection");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center bg-gray-100 rounded-2xl px-4 py-3 transition-all duration-200 ${
          isFocused
            ? "bg-white shadow-md ring-2 ring-blue-500 ring-opacity-20"
            : "hover:bg-gray-200"
        }`}
      >
        <Search
          className={`w-5 h-5 mr-3 transition-colors duration-200 ${
            isFocused ? "text-blue-500" : "text-gray-400"
          }`}
        />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
        />

        {query && (
          <button
            onClick={handleClear}
            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search suggestions or recent searches can be added here */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-500">
            "{query}" uchun qidirish...
          </div>
        </div>
      )}
    </div>
  );
};
