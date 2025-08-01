// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        <Outlet />
      </main>
      <Menu />
    </div>
  );
};
