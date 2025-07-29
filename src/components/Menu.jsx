import React from "react";
import { FaHome } from "react-icons/fa";
import { FaChartLine, FaWallet } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

export const Menu = () => {
  return (
    <div className="absolute left-0 right-0 bottom-0 bg-white border-t-2 border-[#e9ecef] py-3.5 flex justify-around">
      <NavLink
        className="menu items-center text-center text-[#7f8c8d] text-xs cursor-pointer transition-all duration-300 ease"
        to={"/"}
      >
        <div className="text-2xl mb-1">
          <FaHome />
        </div>
        <span>Bosh sahifa</span>
      </NavLink>

      <NavLink
        className="menu items-center text-center text-[#7f8c8d] text-xs cursor-pointer transition-all duration-300 ease"
        to={"/savdolar"}
      >
        <div className="text-2xl mb-1">
          <FaChartLine />
        </div>
        <span>Savdolar</span>
      </NavLink>

      <NavLink
        className="menu items-center text-center text-[#7f8c8d] text-xs cursor-pointer transition-all duration-300 ease"
        to={"/hamyon"}
      >
        <div className="text-2xl mb-1">
          <FaWallet />
        </div>
        <span>Hamyon</span>
      </NavLink>

      <NavLink
        className="menu items-center text-center text-[#7f8c8d] text-xs cursor-pointer transition-all duration-300 ease"
        to={"/sozlamalar"}
      >
        <div className="text-2xl mb-1">
          <IoSettingsSharp />
        </div>
        <span>Sozlamalar</span>
      </NavLink>
    </div>
  );
};
