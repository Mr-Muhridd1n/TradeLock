import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Referal } from "./pages/Referal";
import { Savdolar } from "./pages/Savdolar";
import { Hamyon } from "./pages/Hamyon";
import { Sozlamalar } from "./pages/Sozlamalar";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/savdolar", element: <Savdolar /> },
        { path: "/savdolar/:yangi_savdo", element: <Savdolar /> },
        { path: "/hamyon", element: <Hamyon /> },
        { path: "/hamyon/:status", element: <Hamyon /> },
        { path: "/referal/:id", element: <Referal /> },
        { path: "/sozlamalar", element: <Sozlamalar /> },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
