// src/layouts/MainLayout.jsx - Yangilangan versiya
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";

export const MainLayout = () => {
  const location = useLocation();

  // BottomNavigation ko'rsatilmaydigan sahifalar
  const hideBottomNavRoutes = [
    "/hamyon/toldirish",
    "/hamyon/chiqarish",
    "/savdolar/new",
    "/trade/",
  ];

  const shouldHideBottomNav = hideBottomNavRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className={shouldHideBottomNav ? "" : "pb-20"}>
        <Outlet />
      </main>
      {!shouldHideBottomNav && <BottomNavigation />}
    </div>
  );
};
