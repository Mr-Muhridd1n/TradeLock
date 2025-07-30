// src/components/BottomNavigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { hapticFeedback } from "../utils/telegram";
import { Home, FileText, Wallet, Settings } from "lucide-react";

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Bosh sahifa",
      activeColor: "text-blue-500",
      inactiveColor: "text-gray-400",
    },
    {
      path: "/savdolar",
      icon: FileText,
      label: "Savdolar",
      activeColor: "text-green-500",
      inactiveColor: "text-gray-400",
    },
    {
      path: "/hamyon",
      icon: Wallet,
      label: "Hamyon",
      activeColor: "text-purple-500",
      inactiveColor: "text-gray-400",
    },
    {
      path: "/sozlamalar",
      icon: Settings,
      label: "Sozlamalar",
      activeColor: "text-orange-500",
      inactiveColor: "text-gray-400",
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => hapticFeedback("light")}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-200 ${
                active ? "transform scale-110" : ""
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-50 to-blue-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active ? item.activeColor : item.inactiveColor
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  active ? item.activeColor : item.inactiveColor
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
