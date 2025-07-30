// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { useTelegram } from "./useTelegram";

const API_BASE_URL = "https://mr-muhridd1n.uz/api";

export const useApi = () => {
  const { tg, getUserData } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const authenticateUser = async () => {
      if (!tg || !tg.initData) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData: tg.initData,
          }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    if (!token && tg) {
      authenticateUser();
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [tg, token]);

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("token");
        throw new Error("Authentication required");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API Error");
      }

      return data;
    } catch (error) {
      console.error("API Call error:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    token,
    apiCall,
  };
};
