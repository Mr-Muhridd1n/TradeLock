// src/hooks/useTelegram.js - Yangilangan versiya (Fallback bilan)
import { useEffect, useState } from "react";

export const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (telegram) {
      telegram.ready();
      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user);
      setIsReady(true);
      console.log("✅ Telegram WebApp initialized");
    } else {
      console.log("⚠️ Telegram WebApp not available, using fallback");
      // Fallback uchun mock Telegram user
      const mockUser = {
        id: 123456789,
        first_name: "Test",
        last_name: "User",
        username: "test_user",
        language_code: "uz",
        is_premium: false,
      };
      setUser(mockUser);
      setIsReady(true);
    }
  }, []);

  // Fallback funksiyalar Telegram mavjud bo'lmagan holatda
  const fallbackFunctions = {
    showAlert: (message, callback) => {
      alert(message);
      if (callback) callback();
    },
    showConfirm: (message, callback) => {
      const result = confirm(message);
      if (callback) callback(result);
    },
    hapticFeedback: () => {
      // Browser da haptik feedback bo'lmaydi, console log qilamiz
      console.log("📳 Haptic feedback triggered");
    },
    shareUrl: (url) => {
      if (navigator.share) {
        navigator.share({ url });
      } else {
        navigator.clipboard.writeText(url);
        alert("URL nusxa olindi!");
      }
    },
    openLink: (url) => {
      window.open(url, "_blank");
    },
    readTextFromClipboard: (callback) => {
      if (navigator.clipboard) {
        navigator.clipboard.readText().then(callback);
      } else {
        const text = prompt("Matnni kiriting:");
        if (callback) callback(text);
      }
    },
  };

  // Foydalanuvchi ma'lumotlari
  const getUserData = () => {
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      isPremium: user.is_premium,
      allowsWriteToPm: user.allows_write_to_pm,
    };
  };

  // Telegram app ma'lumotlari
  const getAppData = () => {
    if (!tg) {
      return {
        version: "fallback",
        platform: "web",
        colorScheme: "light",
        isExpanded: true,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
      };
    }

    return {
      version: tg.version,
      platform: tg.platform,
      colorScheme: tg.colorScheme,
      themeParams: tg.themeParams,
      isExpanded: tg.isExpanded,
      viewportHeight: tg.viewportHeight,
      viewportStableHeight: tg.viewportStableHeight,
      headerColor: tg.headerColor,
      backgroundColor: tg.backgroundColor,
      isClosingConfirmationEnabled: tg.isClosingConfirmationEnabled,
      isVerticalSwipesEnabled: tg.isVerticalSwipesEnabled,
    };
  };

  // Ma'lumot yuborish
  const sendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data));
    } else {
      console.log("📤 Send data (fallback):", data);
    }
  };

  // Alert ko'rsatish
  const showAlert = (message, callback) => {
    if (tg) {
      tg.showAlert(message, callback);
    } else {
      fallbackFunctions.showAlert(message, callback);
    }
  };

  // Tasdiqlash dialogi
  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      fallbackFunctions.showConfirm(message, callback);
    }
  };

  // Haptic feedback
  const hapticFeedback = (type = "impact", style = "medium") => {
    if (tg && tg.HapticFeedback) {
      if (type === "impact") {
        tg.HapticFeedback.impactOccurred(style);
      } else if (type === "notification") {
        tg.HapticFeedback.notificationOccurred(style);
      } else if (type === "selection") {
        tg.HapticFeedback.selectionChanged();
      }
    } else {
      fallbackFunctions.hapticFeedback();
    }
  };

  // Link ochish
  const openLink = (url, options = {}) => {
    if (tg) {
      tg.openLink(url, options);
    } else {
      fallbackFunctions.openLink(url);
    }
  };

  // Clipboard operatsiyalari
  const readTextFromClipboard = (callback) => {
    if (tg) {
      tg.readTextFromClipboard(callback);
    } else {
      fallbackFunctions.readTextFromClipboard(callback);
    }
  };

  return {
    tg,
    user,
    isReady,
    getUserData,
    getAppData,
    sendData,
    showAlert,
    showConfirm,
    hapticFeedback,
    openLink,
    readTextFromClipboard,
    // Qo'shimcha fallback funksiyalar
    isOfflineMode: !tg,
  };
};
