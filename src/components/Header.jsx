import React from "react";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Dinamik header content
  const getHeaderContent = () => {
    if (pathname === "/") {
      return {
        title: "Trade Lock",
        subtitle: "Xavfsiz Savdo Platformasi",
      };
    } else if (pathname.startsWith("/savdolar")) {
      if (pathname.includes("/new")) {
        return {
          title: "Yangi savdo",
          subtitle: "Savdolaringiz uchun sozlamalarni sozlang",
        };
      }
      return {
        title: "Savdolar",
        subtitle: "Sizning savdolaringiz ma'lumoti",
      };
    } else if (pathname.startsWith("/hamyon")) {
      return {
        title: "Hamyon",
        subtitle: "Sizning balansingiz haqida ma'lumot",
      };
    } else if (pathname.startsWith("/sozlamalar")) {
      return {
        title: "Sozlamalar",
        subtitle: "Sizning maxfiy sozlamalaringiz",
      };
    } else if (pathname.startsWith("/trade/")) {
      return {
        title: "Savdoga qo'shilish",
        subtitle: "Xavfsiz savdo platformasi",
      };
    }

    return {
      title: "Trade Lock",
      subtitle: "Xavfsiz Savdo Platformasi",
    };
  };

  const { title, subtitle } = getHeaderContent();

  return (
    <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white">
      <div className="flex flex-col text-center py-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="opacity-90">{subtitle}</p>
      </div>
    </div>
  );
};
