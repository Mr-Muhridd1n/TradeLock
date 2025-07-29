// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu";
import { Header } from "../components/Header";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Header />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Menu />
    </div>
  );
};
