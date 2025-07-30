import { GlobalContext } from "../context/MainGlobalContext";
import { useContext } from "react";

export const useMainGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useMainGlobalContext() must be in the MainGlobalContext()"
    );
  }

  return context;
};
