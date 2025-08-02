// src/hooks/useTelegram.js - Telegram WebApp uchun mukammal optimallashtirilgan
import { useEffect, useState } from "react";

export const useTelegram = () => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [startParam, setStartParam] = useState(null);
  const [platform, setPlatform] = useState("web");

  useEffect(() => {
    let telegram = null;

    try {
      telegram = window.Telegram?.WebApp;
    } catch (error) {
      console.error("Telegram WebApp obyektiga kirishda xatolik:", error);
    }

    // Telegram WebApp mavjudligini tekshirish
    const isTelegramWebAppAvailable = () => {
      return !!(
        telegram &&
        typeof telegram.ready === "function" &&
        typeof telegram.expand === "function"
      );
    };

    if (isTelegramWebAppAvailable()) {
      try {
        console.log("Telegram WebApp aniqlandi");
        telegram.ready();
        setTg(telegram);
        setPlatform("telegram");

        // User ma'lumotlarini xavfsiz olish
        let telegramUser = null;
        try {
          telegramUser = telegram.initDataUnsafe?.user;
          if (telegramUser && telegramUser.id) {
            setUser(telegramUser);
            console.log(
              "Telegram user muvaffaqiyatli olindi:",
              telegramUser.first_name
            );
          } else {
            console.warn("Telegram user ma'lumotlari topilmadi");
          }
        } catch (userError) {
          console.error(
            "Telegram user ma'lumotlarini olishda xatolik:",
            userError
          );
        }

        // Start parameter ni xavfsiz olish
        try {
          const param = telegram.initDataUnsafe?.start_param;
          if (param) {
            setStartParam(param);
            console.log("Start param olindi:", param);
            handleStartParam(param);
          }
        } catch (paramError) {
          console.error("Start param olishda xatolik:", paramError);
        }

        // Query string parametrlarini tekshirish
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const queryParam = urlParams.get("startapp");
          if (queryParam && queryParam.startsWith("savdo_")) {
            const code = queryParam.replace("savdo_", "");
            console.log("Trade code from query param:", code);
            navigateToTrade(code);
          }
        } catch (queryError) {
          console.error("Query param tekshirishda xatolik:", queryError);
        }

        // InitData dan parametrlar olish
        try {
          if (telegram.initData) {
            const initDataParams = new URLSearchParams(telegram.initData);
            const initStartParam = initDataParams.get("start_param");
            if (initStartParam && !startParam) {
              console.log("InitData dan start_param topildi:", initStartParam);
              setStartParam(initStartParam);
              handleStartParam(initStartParam);
            }
          }
        } catch (initDataError) {
          console.error("InitData qayta ishlashda xatolik:", initDataError);
        }

        // WebApp sozlamalarini xavfsiz o'rnatish
        try {
          if (typeof telegram.expand === "function") {
            telegram.expand();
          }
          if (typeof telegram.setHeaderColor === "function") {
            telegram.setHeaderColor("#4facfe");
          }
          if (typeof telegram.setBackgroundColor === "function") {
            telegram.setBackgroundColor("#f8f9fa");
          }
        } catch (setupError) {
          console.error(
            "WebApp sozlamalarini o'rnatishda xatolik:",
            setupError
          );
        }

        setIsReady(true);
      } catch (error) {
        console.error("Telegram WebApp ishga tushirishda xatolik:", error);
        fallbackToWebMode();
      }
    } else {
      console.log("Telegram WebApp emas, web rejimiga o'tish");
      fallbackToWebMode();
    }

    function fallbackToWebMode() {
      setPlatform("web");
      setIsReady(true);

      // Development da demo user
      if (isDevelopmentMode()) {
        setUser({
          id: 123456789,
          first_name: "Demo",
          last_name: "User",
          username: "demo_user",
        });
      }

      // URL parametrlarini web rejimida ham tekshirish
      try {
        checkWebUrlParams();
      } catch (error) {
        console.error("Web URL params tekshirishda xatolik:", error);
      }
    }

    function handleStartParam(param) {
      if (!param) return;

      let tradeCode = null;

      if (param.startsWith("savdo_")) {
        tradeCode = param.replace("savdo_", "");
      } else if (param.startsWith("trade_")) {
        tradeCode = param.replace("trade_", "");
      } else {
        tradeCode = param;
      }

      if (tradeCode) {
        console.log("Trade code ajratildi:", tradeCode);
        navigateToTrade(tradeCode);
      }
    }

    function checkWebUrlParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const trade =
        urlParams.get("trade") ||
        urlParams.get("savdo") ||
        urlParams.get("code");

      if (trade) {
        console.log("Web rejimida trade code topildi:", trade);
        navigateToTrade(trade);
      }
    }

    function navigateToTrade(code) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/join/") && !currentPath.includes("/trade/")) {
        try {
          window.history.replaceState(null, "", `/join/${code}`);
          console.log("Savdo sahifasiga yo'naltirildi:", code);
        } catch (navError) {
          console.error("Navigation xatolik:", navError);
        }
      }
    }

    function isDevelopmentMode() {
      return (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("192.168") ||
        window.location.protocol === "file:"
      );
    }
  }, []);

  // Xavfsiz metodlar
  const sendData = (data) => {
    try {
      if (tg && typeof tg.sendData === "function") {
        tg.sendData(JSON.stringify(data));
      } else {
        console.log("sendData chaqirilishi kerak edi:", data);
      }
    } catch (error) {
      console.error("sendData xatolik:", error);
    }
  };

  const closeTg = () => {
    try {
      if (tg && typeof tg.close === "function") {
        tg.close();
      } else {
        window.close();
      }
    } catch (error) {
      console.error("closeTg xatolik:", error);
    }
  };

  const showAlert = (message) => {
    try {
      if (tg && typeof tg.showAlert === "function") {
        tg.showAlert(message);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("showAlert xatolik:", error);
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    try {
      if (tg && typeof tg.showConfirm === "function") {
        tg.showConfirm(message, callback);
      } else {
        const result = confirm(message);
        if (typeof callback === "function") {
          callback(result);
        }
      }
    } catch (error) {
      console.error("showConfirm xatolik:", error);
      const result = confirm(message);
      if (typeof callback === "function") {
        callback(result);
      }
    }
  };

  const hapticFeedback = (type = "impact", style = "medium") => {
    try {
      if (tg && tg.HapticFeedback) {
        if (
          type === "impact" &&
          typeof tg.HapticFeedback.impactOccurred === "function"
        ) {
          tg.HapticFeedback.impactOccurred(style);
        } else if (
          type === "notification" &&
          typeof tg.HapticFeedback.notificationOccurred === "function"
        ) {
          tg.HapticFeedback.notificationOccurred(style);
        } else if (
          type === "selection" &&
          typeof tg.HapticFeedback.selectionChanged === "function"
        ) {
          tg.HapticFeedback.selectionChanged();
        }
      }
    } catch (error) {
      console.error("Haptic feedback xatolik:", error);
    }
  };

  const mainButton = {
    show: (text, callback) => {
      try {
        if (tg && tg.MainButton) {
          tg.MainButton.text = text;
          if (typeof tg.MainButton.show === "function") {
            tg.MainButton.show();
          }
          if (callback && typeof tg.MainButton.onClick === "function") {
            tg.MainButton.onClick(callback);
          }
        }
      } catch (error) {
        console.error("MainButton show xatolik:", error);
      }
    },
    hide: () => {
      try {
        if (tg && tg.MainButton && typeof tg.MainButton.hide === "function") {
          tg.MainButton.hide();
        }
      } catch (error) {
        console.error("MainButton hide xatolik:", error);
      }
    },
    setText: (text) => {
      try {
        if (tg && tg.MainButton) {
          tg.MainButton.text = text;
        }
      } catch (error) {
        console.error("MainButton setText xatolik:", error);
      }
    },
    setColor: (color) => {
      try {
        if (tg && tg.MainButton) {
          tg.MainButton.color = color;
        }
      } catch (error) {
        console.error("MainButton setColor xatolik:", error);
      }
    },
    setTextColor: (color) => {
      try {
        if (tg && tg.MainButton) {
          tg.MainButton.textColor = color;
        }
      } catch (error) {
        console.error("MainButton setTextColor xatolik:", error);
      }
    },
    enable: () => {
      try {
        if (tg && tg.MainButton && typeof tg.MainButton.enable === "function") {
          tg.MainButton.enable();
        }
      } catch (error) {
        console.error("MainButton enable xatolik:", error);
      }
    },
    disable: () => {
      try {
        if (
          tg &&
          tg.MainButton &&
          typeof tg.MainButton.disable === "function"
        ) {
          tg.MainButton.disable();
        }
      } catch (error) {
        console.error("MainButton disable xatolik:", error);
      }
    },
  };

  const backButton = {
    show: (callback) => {
      try {
        if (tg && tg.BackButton) {
          if (typeof tg.BackButton.show === "function") {
            tg.BackButton.show();
          }
          if (callback && typeof tg.BackButton.onClick === "function") {
            tg.BackButton.onClick(callback);
          }
        }
      } catch (error) {
        console.error("BackButton show xatolik:", error);
      }
    },
    hide: () => {
      try {
        if (tg && tg.BackButton && typeof tg.BackButton.hide === "function") {
          tg.BackButton.hide();
        }
      } catch (error) {
        console.error("BackButton hide xatolik:", error);
      }
    },
  };

  // Theme parametrlarini xavfsiz olish
  const getThemeParams = () => {
    try {
      if (tg && tg.themeParams) {
        return tg.themeParams;
      }
    } catch (error) {
      console.error("Theme params olishda xatolik:", error);
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

  // URL parametrlarini olish
  const getUrlParams = () => {
    try {
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
    } catch (error) {
      console.error("URL params olishda xatolik:", error);
      return {
        trade: null,
        savdo: null,
        code: null,
        startapp: null,
        pathCode: null,
        startParam: null,
        firstCode: null,
      };
    }
  };

  // Platform detection
  const isTelegramWebApp = () => platform === "telegram";
  const isWebBrowser = () => platform === "web";

  // Viewport ma'lumotlarini xavfsiz olish
  const getViewport = () => {
    try {
      if (tg) {
        return {
          height: tg.viewportHeight || window.innerHeight,
          stableHeight: tg.viewportStableHeight || window.innerHeight,
          isExpanded: tg.isExpanded || false,
        };
      }
    } catch (error) {
      console.error("Viewport ma'lumotlari olishda xatolik:", error);
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
