// src/App.jsx - Yangilangan versiya
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Savdolar } from "./pages/Savdolar";
import { Hamyon } from "./pages/Hamyon";
import { Sozlamalar } from "./pages/Sozlamalar";
import { JoinTrade } from "./pages/JoinTrade";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotificationContainer } from "./components/NotificationContainer";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "savdolar",
          element: <Savdolar />,
        },
        {
          path: "savdolar/:action",
          element: <Savdolar />,
        },
        {
          path: "hamyon",
          element: <Hamyon />,
        },
        {
          path: "hamyon/:action",
          element: <Hamyon />,
        },
        {
          path: "sozlamalar",
          element: <Sozlamalar />,
        },
        {
          path: "trade/:secretLink",
          element: <JoinTrade />,
        },
      ],
    },
  ]);

  return (
    <ErrorBoundary>
      <div className="app min-h-screen bg-gray-50">
        <RouterProvider router={routes} />
        <NotificationContainer />
        <LoadingScreen />
      </div>
    </ErrorBoundary>
  );
}

export default App;
