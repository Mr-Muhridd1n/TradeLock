// src/components/Header.jsx
import React from "react";

export const Header = ({ title, children }) => {
  const getTitleText = () => {
    switch (title) {
      case "home":
        return {
          title: "Trade Lock",
          subtitle: "Xavfsiz Savdo Platformasi",
        };
      case "savdolar":
        return {
          title: "Savdolar",
          subtitle: "Sizning savdolaringiz ma'lumoti",
        };
      case "new_savdolar":
        return {
          title: "Yangi savdo",
          subtitle: "Savdolaringiz uchun sozlamalarni sozlang",
        };
      case "hamyon":
        return {
          title: "Hamyon",
          subtitle: "Sizning balansingiz haqida ma'lumot",
        };
      case "sozlamalar":
        return {
          title: "Sozlamalar",
          subtitle: "Sizning maxfiy sozlamalaringiz",
        };
      default:
        return {
          title: "Trade Lock",
          subtitle: "Xavfsiz Savdo Platformasi",
        };
    }
  };

  const { title: headerTitle, subtitle } = getTitleText();

  return (
    <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white">
      <div className="flex flex-col text-center py-5">
        <h1 className="text-2xl font-bold">{headerTitle}</h1>
        <p className="opacity-90">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};
