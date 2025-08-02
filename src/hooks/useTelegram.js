// src/hooks/useTelegram.js - Yaxshilangan Telegram integratsiyasi
import { useEffect, useState } from "react";

export const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [startParam, setStartParam] = useState(null);
  const [platform, setPlatform] = useState("web"); // 'telegram' | 'web'

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (telegram) {
      console.log("Telegram WebApp detected");
      telegram.ready();
      setTg(telegram);
      setPlatform("telegram");

      // User ma'lumotlarini olish
      const telegramUser = telegram.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
        console.log("Telegram user:", telegramUser);
      }

      // Start parameter ni olish (savdo kodi uchun)
      const param = telegram.initDataUnsafe?.start_param;
      if (param) {
        setStartParam(param);
        console.log("Telegram start_param:", param);

        // Start param dan savdo kodini ajratib olish
        let tradeCode = null;
        if (param.startsWith("savdo_")) {
          tradeCode = param.replace("savdo_", "");
        } else if (param.startsWith("trade_")) {
          tradeCode = param.replace("trade_", "");
        } else {
          tradeCode = param;
        }

        if (tradeCode) {
          console.log("Extracted trade code from start_param:", tradeCode);
          // URL ni yangilash savdo sahifasiga yo'naltirish uchun
          const currentPath = window.location.pathname;
          if (
            !currentPath.includes("/join/") &&
            !currentPath.includes("/trade/")
          ) {
            window.history.replaceState(null, "", `/join/${tradeCode}`);
          }
        }
      }

      // Query string parametrlarini ham tekshirish (startapp uchun)
      const urlParams = new URLSearchParams(window.location.search);

      // 1. Oddiy startapp parametri
      const queryParam = urlParams.get("startapp");
      if (queryParam && queryParam.startsWith("savdo_")) {
        const code = queryParam.replace("savdo_", "");
        console.log("Trade code from startapp query:", code);
        if (!window.location.pathname.includes("/join/")) {
          window.history.replaceState(null, "", `/join/${code}`);
        }
      }

      // 2. Telegram initData dan parametrlar olish
      if (telegram.initData) {
        try {
          const initDataParams = new URLSearchParams(telegram.initData);

          // start_param ni initData dan ham olish mumkin
          const initStartParam = initDataParams.get("start_param");
          if (initStartParam && !param) {
            console.log("Found start_param in initData:", initStartParam);
            setStartParam(initStartParam);

            let tradeCode = null;
            if (initStartParam.startsWith("savdo_")) {
              tradeCode = initStartParam.replace("savdo_", "");
            } else if (initStartParam.startsWith("trade_")) {
              tradeCode = initStartParam.replace("trade_", "");
            } else {
              tradeCode = initStartParam;
            }

            if (tradeCode && !window.location.pathname.includes("/join/")) {
              window.history.replaceState(null, "", `/join/${tradeCode}`);
            }
          }
        } catch (error) {
          console.error("Error parsing initData:", error);
        }
      }

      setIsReady(true);

      // WebApp sozlamalarini o'rnatish
      telegram.expand();
      telegram.setHeaderColor("#4facfe");
      telegram.setBackgroundColor("#f8f9fa");

      // Viewport ni sozlash
      telegram.viewportHeight = window.innerHeight;
      telegram.viewportStableHeight = window.innerHeight;
    } else {
      console.log("Telegram WebApp not detected, using web mode");
      setPlatform("web");
      setIsReady(true);

      // Web mode uchun demo user
      setUser({
        id: 123456789,
        first_name: "Demo",
        last_name: "User",
        username: "demo_user",
      });

      // URL parametrlarini web mode da ham tekshirish
      const urlParams = new URLSearchParams(window.location.search);
      const trade =
        urlParams.get("trade") ||
        urlParams.get("savdo") ||
        urlParams.get("code");
      if (trade) {
        console.log("Trade code from URL in web mode:", trade);
        if (!window.location.pathname.includes("/join/")) {
          window.history.replaceState(null, "", `/join/${trade}`);
        }
      }
    }
  }, []);

  const sendData = (data) => {
    if (tg) {
      tg.sendData(JSON.stringify(data));
    } else {
      console.log("Would send data:", data);
    }
  };

  const closeTg = () => {
    if (tg) {
      tg.close();
    } else {
      window.close();
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
      try {
        if (type === "impact") {
          tg.HapticFeedback.impactOccurred(style);
        } else if (type === "notification") {
          tg.HapticFeedback.notificationOccurred(style);
        } else if (type === "selection") {
          tg.HapticFeedback.selectionChanged();
        }
      } catch (error) {
        console.log("Haptic feedback not available:", error);
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
    setText: (text) => {
      if (tg && tg.MainButton) {
        tg.MainButton.text = text;
      }
    },
    setColor: (color) => {
      if (tg && tg.MainButton) {
        tg.MainButton.color = color;
      }
    },
    setTextColor: (color) => {
      if (tg && tg.MainButton) {
        tg.MainButton.textColor = color;
      }
    },
    enable: () => {
      if (tg && tg.MainButton) {
        tg.MainButton.enable();
      }
    },
    disable: () => {
      if (tg && tg.MainButton) {
        tg.MainButton.disable();
      }
    },
  };

  const backButton = {
    show: (callback) => {
      if (tg && tg.BackButton) {
        tg.BackButton.show();
        if (callback) {
          tg.BackButton.onClick(callback);
        }
      }
    },
    hide: () => {
      if (tg && tg.BackButton) {
        tg.BackButton.hide();
      }
    },
  };

  // Theme dan ranglarni olish
  const getThemeParams = () => {
    if (tg && tg.themeParams) {
      return tg.themeParams;
    }
    return {
      bg_color: "#ffffff",
      text_color: "#000000",
      hint_color: "#999999",
      link_color: "#4facfe",
      button_color: "#4facfe",
      button_text_color: "#ffffff",
    };
  };

  // URL parametrlarini olish utility function
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split("/").filter(Boolean);

    return {
      // Query parametrlar
      trade: urlParams.get("trade"),
      savdo: urlParams.get("savdo"),
      code: urlParams.get("code"),
      startapp: urlParams.get("startapp"),

      // Path parametrlar
      pathCode: pathParts.length >= 2 ? pathParts[1] : null,

      // Telegram parametrlar
      startParam: startParam,

      // Birinchi topilgan kod
      firstCode:
        urlParams.get("trade") ||
        urlParams.get("savdo") ||
        urlParams.get("code") ||
        (pathParts.length >= 2 ? pathParts[1] : null) ||
        (startParam && startParam.includes("_")
          ? startParam.split("_")[1]
          : startParam),
    };
  };

  // Platform detection
  const isTelegramWebApp = () => platform === "telegram";
  const isWebBrowser = () => platform === "web";

  // Viewport ma'lumotlari
  const getViewport = () => {
    if (tg) {
      return {
        height: tg.viewportHeight,
        stableHeight: tg.viewportStableHeight,
        isExpanded: tg.isExpanded,
      };
    }
    return {
      height: window.innerHeight,
      stableHeight: window.innerHeight,
      isExpanded: true,
    };
  };

  return {
    tg,
    user,
    isReady,
    startParam,
    platform,
    sendData,
    closeTg,
    showAlert,
    showConfirm,
    hapticFeedback,
    mainButton,
    backButton,
    getThemeParams,
    getUrlParams,
    isTelegramWebApp,
    isWebBrowser,
    getViewport,
  };
};
