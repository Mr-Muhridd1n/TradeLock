// src/hooks/useUser.js - Yangilangan versiya
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { OfflineStorage, defaultUser } from "../utils/offlineStorage";

export const useUser = () => {
  const { apiCall, isAuthenticated, isOfflineMode } = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      let userData;
      if (isOfflineMode) {
        // Offline rejimda localStorage dan olish
        userData = OfflineStorage.load(OfflineStorage.KEYS.USER, defaultUser);
        console.log("📱 Loading user from offline storage");
      } else {
        // Online rejimda API dan olish
        userData = await apiCall("user");
        // Ma'lumotni localStorage ga saqlash
        OfflineStorage.save(OfflineStorage.KEYS.USER, userData);
      }

      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.message);

      // Xato bo'lsa, offline ma'lumotlarni ishlatishga harakat qilish
      const cachedUser = OfflineStorage.load(OfflineStorage.KEYS.USER);
      if (cachedUser) {
        console.log("📱 Using cached user data after API error");
        setUser(cachedUser);
        setError(null); // Cached data bor bo'lsa, error ni clear qilish
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);

      let updatedUser;
      if (isOfflineMode) {
        // Offline rejimda localStorage ni yangilash
        const currentUser = OfflineStorage.load(
          OfflineStorage.KEYS.USER,
          defaultUser
        );
        updatedUser = {
          ...currentUser,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
        console.log("📱 Updated user profile offline");
      } else {
        // Online rejimda API ga yuborish
        updatedUser = await apiCall("user", {
          method: "PUT",
          body: JSON.stringify(updates),
        });
        // Yangilangan ma'lumotni localStorage ga saqlash
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
      }

      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateSettings = async (settings) => {
    try {
      setError(null);

      let updatedUser;
      if (isOfflineMode) {
        // Offline rejimda localStorage ni yangilash
        const currentUser = OfflineStorage.load(
          OfflineStorage.KEYS.USER,
          defaultUser
        );
        updatedUser = {
          ...currentUser,
          settings: { ...currentUser.settings, ...settings },
          updated_at: new Date().toISOString(),
        };
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
        console.log("📱 Updated user settings offline");
      } else {
        // Online rejimda API ga yuborish
        updatedUser = await apiCall("user/settings", {
          method: "PUT",
          body: JSON.stringify(settings),
        });
        // Yangilangan ma'lumotni localStorage ga saqlash
        OfflineStorage.save(OfflineStorage.KEYS.USER, updatedUser);
      }

      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error("Failed to update settings:", err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [isAuthenticated, isOfflineMode]);

  return {
    user,
    loading,
    error,
    updateProfile,
    updateSettings,
    refetch: fetchUserProfile,
  };
};
