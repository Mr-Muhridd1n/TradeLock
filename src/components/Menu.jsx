// src/components/Menu.jsx
import React from "react";
import { Home, ShoppingBag, Wallet, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Menu = () => {
  return (
    <div className="fixed left-0 right-0 bottom-0 bg-white border-t-2 border-[#e9ecef] py-3.5 flex justify-around z-50">
      <NavLink
        className={({ isActive }) =>
          `menu flex flex-col items-center text-center text-xs cursor-pointer transition-all duration-300 ease px-4 py-2 rounded-lg ${
            isActive
              ? "text-[#4facfe] bg-blue-50 font-semibold"
              : "text-[#7f8c8d] hover:text-[#4facfe]"
          }`
        }
        to="/"
      >
        <div className="text-2xl mb-1">
          <Home size={24} />
        </div>
        <span>Bosh sahifa</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `menu flex flex-col items-center text-center text-xs cursor-pointer transition-all duration-300 ease px-4 py-2 rounded-lg ${
            isActive
              ? "text-[#4facfe] bg-blue-50 font-semibold"
              : "text-[#7f8c8d] hover:text-[#4facfe]"
          }`
        }
        to="/savdolar"
      >
        <div className="text-2xl mb-1">
          <ShoppingBag size={24} />
        </div>
        <span>Savdolar</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `menu flex flex-col items-center text-center text-xs cursor-pointer transition-all duration-300 ease px-4 py-2 rounded-lg ${
            isActive
              ? "text-[#4facfe] bg-blue-50 font-semibold"
              : "text-[#7f8c8d] hover:text-[#4facfe]"
          }`
        }
        to="/hamyon"
      >
        <div className="text-2xl mb-1">
          <Wallet size={24} />
        </div>
        <span>Hamyon</span>
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `menu flex flex-col items-center text-center text-xs cursor-pointer transition-all duration-300 ease px-4 py-2 rounded-lg ${
            isActive
              ? "text-[#4facfe] bg-blue-50 font-semibold"
              : "text-[#7f8c8d] hover:text-[#4facfe]"
          }`
        }
        to="/sozlamalar"
      >
        <div className="text-2xl mb-1">
          <Settings size={24} />
        </div>
        <span>Sozlamalar</span>
      </NavLink>
    </div>
  );
};
