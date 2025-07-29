import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu";
import { Header } from "../components/Header";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Menu />
    </>
  );
};
