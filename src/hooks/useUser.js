// src/hooks/useUser.js
import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useUser = () => {
  const { apiCall, isAuthenticated } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const userData = await apiCall("user");
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await apiCall("user", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSettings = async (settings) => {
    try {
      const updatedUser = await apiCall("user/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [isAuthenticated]);

  return {
    user,
    loading,
    error,
    updateProfile,
    updateSettings,
    refetch: fetchUserProfile,
  };
};
