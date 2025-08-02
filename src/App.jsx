// src/App.jsx - Yaxshilangan router konfiguratsiyasi
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "./context/ApiContext";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/Home";
import { Savdolar } from "./pages/Savdolar";
import { Hamyon } from "./pages/Hamyon";
import { Sozlamalar } from "./pages/Sozlamalar";
import { NewSavdoForm } from "./pages/NewSavdoForm";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminTrades } from "./pages/admin/AdminTrades";
import { JoinTrade } from "./pages/JoinTrade";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role") || "user";

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Trade Join Component - URL parametrlarini qo'llab-quvvatlaydi
const PublicJoinTrade = () => {
  return <JoinTrade />;
};

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "savdolar", element: <Savdolar /> },
        { path: "savdolar/new", element: <NewSavdoForm /> },
        { path: "hamyon", element: <Hamyon /> },
        { path: "hamyon/:status", element: <Hamyon /> },
        { path: "sozlamalar", element: <Sozlamalar /> },

        // Savdo join routelari - turli formatlarni qo'llab-quvvatlaydi
        { path: "join/:secretCode", element: <PublicJoinTrade /> },
        { path: "trade/:secretCode", element: <PublicJoinTrade /> },
        { path: "savdo/:secretCode", element: <PublicJoinTrade /> },

        // Query parameter bilan ham ishlaydi
        { path: "join", element: <PublicJoinTrade /> },
        { path: "trade", element: <PublicJoinTrade /> },
        { path: "savdo", element: <PublicJoinTrade /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "users", element: <AdminUsers /> },
        { path: "trades", element: <AdminTrades /> },
      ],
    },

    // Fallback routes - eski formatlarni qo'llab-quvvatlash
    {
      path: "/start",
      element: <PublicJoinTrade />,
    },
    {
      path: "/t/:secretCode", // Telegram style short links
      element: <PublicJoinTrade />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <RouterProvider router={routes} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#363636",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            },
            success: {
              style: {
                background: "#10B981",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10B981",
              },
            },
            error: {
              style: {
                background: "#EF4444",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#EF4444",
              },
            },
          }}
        />
      </ApiProvider>
    </QueryClientProvider>
  );
}

export default App;
