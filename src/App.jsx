// src/App.jsx - Yangilangan versiya
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
import { Referal } from "./pages/Referal";
import { Savdolar } from "./pages/Savdolar";
import { Hamyon } from "./pages/Hamyon";
import { Sozlamalar } from "./pages/Sozlamalar";
import { NewSavdoForm } from "./pages/NewSavdoForm";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminTrades } from "./pages/admin/AdminTrades";
import { JoinTrade } from "./pages/JoinTrade";
import { TradeDetails } from "./pages/TradeDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/savdolar", element: <Savdolar /> },
        { path: "/savdolar/new", element: <NewSavdoForm /> },
        { path: "/savdolar/:id", element: <TradeDetails /> },
        { path: "/hamyon", element: <Hamyon /> },
        { path: "/hamyon/:status", element: <Hamyon /> },
        { path: "/referal/:id", element: <Referal /> },
        { path: "/sozlamalar", element: <Sozlamalar /> },
        { path: "/join/:secretCode", element: <JoinTrade /> },
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
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <RouterProvider router={routes} />
      </ApiProvider>
    </QueryClientProvider>
  );
}

export default App;
