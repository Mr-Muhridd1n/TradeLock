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

        const result = await response.json();
        console.log("Full API response:", result);

        // PHP API response structure:
        // {
        //   "success": true,
        //   "data": {
        //     "success": true,
        //     "token": "actual_token_here",
        //     "user": {...}
        //   }
        // }

        if (result.success && result.data) {
          const { token, user, success } = result.data;

          if (success && token) {
            console.log("✅ Authentication successful");
            console.log("Token preview:", token.substring(0, 30) + "...");
            console.log("User:", user);

            setToken(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setIsAuthenticated(true);
          } else {
            console.error("❌ Auth data invalid:", result.data);
          }
        } else {
          console.error("❌ API error:", result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Network error:", error);
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
