// src/hooks/useTelegram.js
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

      // Set theme
      telegram.expand();
      telegram.setHeaderColor("#4facfe");
      telegram.setBackgroundColor("#f8f9fa");
    } else {
      // Demo mode for development
      setIsReady(true);
      setUser({
        id: 123456789,
        first_name: "Demo",
        last_name: "User",
        username: "demo_user",
      });
    }
  }, []);

  const sendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data));
    }
  };

  const closeTg = () => {
    if (tg) {
      tg.close();
    }
  };

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = (type = "impact", style = "medium") => {
    if (tg && tg.HapticFeedback) {
      if (type === "impact") {
        tg.HapticFeedback.impactOccurred(style);
      } else if (type === "notification") {
        tg.HapticFeedback.notificationOccurred(style);
      } else if (type === "selection") {
        tg.HapticFeedback.selectionChanged();
      }
    }
  };

  const mainButton = {
    show: (text, callback) => {
      if (tg && tg.MainButton) {
        tg.MainButton.text = text;
        tg.MainButton.show();
        if (callback) {
          tg.MainButton.onClick(callback);
        }
      }
    },
    hide: () => {
      if (tg && tg.MainButton) {
        tg.MainButton.hide();
      }
    },
  };

  return {
    tg,
    user,
    isReady,
    sendData,
    closeTg,
    showAlert,
    showConfirm,
    hapticFeedback,
    mainButton,
  };
};
