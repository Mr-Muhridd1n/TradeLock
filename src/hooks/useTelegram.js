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
    }
  }, []);

  // Foydalanuvchi ma'lumotlari
  const getUserData = () => {
    if (!tg) return null;

    return {
      id: user?.id,
      firstName: user?.first_name,
      lastName: user?.last_name,
      username: user?.username,
      languageCode: user?.language_code,
      isPremium: user?.is_premium,
      allowsWriteToPm: user?.allows_write_to_pm,
    };
  };

  // Telegram app ma'lumotlari
  const getAppData = () => {
    if (!tg) return null;

    return {
      version: tg.version,
      platform: tg.platform,
      colorScheme: tg.colorScheme, // 'light' yoki 'dark'
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
    }
  };

  // Appni yopish
  const closeTg = () => {
    if (tg) {
      tg.close();
    }
  };

  // Appni kengaytirish
  const expand = () => {
    if (tg) {
      tg.expand();
    }
  };

  // Popup ko'rsatish
  const showPopup = (params) => {
    if (tg) {
      tg.showPopup(params);
    }
  };

  // Alert ko'rsatish
  const showAlert = (message, callback) => {
    if (tg) {
      tg.showAlert(message, callback);
    }
  };

  // Tasdiqlash dialogi
  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    }
  };

  // Scan QR kod
  const showScanQrPopup = (params, callback) => {
    if (tg) {
      tg.showScanQrPopup(params, callback);
    }
  };

  // Scan QR ni yopish
  const closeScanQrPopup = () => {
    if (tg) {
      tg.closeScanQrPopup();
    }
  };

  // Clipboard ga yozish
  const readTextFromClipboard = (callback) => {
    if (tg) {
      tg.readTextFromClipboard(callback);
    }
  };

  // Biometric authentication
  const requestBiometricAuth = (params, callback) => {
    if (tg && tg.BiometricManager) {
      tg.BiometricManager.requestAccess(params, callback);
    }
  };

  // Location ma'lumotlari
  const requestLocation = (callback) => {
    if (tg && tg.LocationManager) {
      tg.LocationManager.getLocation(callback);
    }
  };

  // Haptic feedback
  const hapticFeedback = (type = "impact", style = "medium") => {
    if (tg && tg.HapticFeedback) {
      if (type === "impact") {
        tg.HapticFeedback.impactOccurred(style); // 'light', 'medium', 'heavy'
      } else if (type === "notification") {
        tg.HapticFeedback.notificationOccurred(style); // 'error', 'success', 'warning'
      } else if (type === "selection") {
        tg.HapticFeedback.selectionChanged();
      }
    }
  };

  // Main button boshqaruvi
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
    showProgress: () => {
      if (tg && tg.MainButton) {
        tg.MainButton.showProgress();
      }
    },
    hideProgress: () => {
      if (tg && tg.MainButton) {
        tg.MainButton.hideProgress();
      }
    },
    setParams: (params) => {
      if (tg && tg.MainButton) {
        tg.MainButton.setParams(params);
      }
    },
  };

  // Back button boshqaruvi
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

  // Settings button boshqaruvi
  const settingsButton = {
    show: (callback) => {
      if (tg && tg.SettingsButton) {
        tg.SettingsButton.show();
        if (callback) {
          tg.SettingsButton.onClick(callback);
        }
      }
    },
    hide: () => {
      if (tg && tg.SettingsButton) {
        tg.SettingsButton.hide();
      }
    },
  };

  // Cloud Storage
  const cloudStorage = {
    setItem: (key, value, callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.setItem(key, value, callback);
      }
    },
    getItem: (key, callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.getItem(key, callback);
      }
    },
    getItems: (keys, callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.getItems(keys, callback);
      }
    },
    removeItem: (key, callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.removeItem(key, callback);
      }
    },
    removeItems: (keys, callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.removeItems(keys, callback);
      }
    },
    getKeys: (callback) => {
      if (tg && tg.CloudStorage) {
        tg.CloudStorage.getKeys(callback);
      }
    },
  };

  // Web App ni yopishdan oldin tasdiqlash
  const enableClosingConfirmation = () => {
    if (tg) {
      tg.enableClosingConfirmation();
    }
  };

  const disableClosingConfirmation = () => {
    if (tg) {
      tg.disableClosingConfirmation();
    }
  };

  // Vertical swipes
  const enableVerticalSwipes = () => {
    if (tg) {
      tg.enableVerticalSwipes();
    }
  };

  const disableVerticalSwipes = () => {
    if (tg) {
      tg.disableVerticalSwipes();
    }
  };

  // Invoice ochish
  const openInvoice = (url, callback) => {
    if (tg) {
      tg.openInvoice(url, callback);
    }
  };

  // Link ochish
  const openLink = (url, options = {}) => {
    if (tg) {
      tg.openLink(url, options);
    }
  };

  // Telegram link ochish
  const openTelegramLink = (url) => {
    if (tg) {
      tg.openTelegramLink(url);
    }
  };

  return {
    tg,
    user,
    isReady,
    getUserData,
    getAppData,
    sendData,
    closeTg,
    expand,
    showPopup,
    showAlert,
    showConfirm,
    showScanQrPopup,
    closeScanQrPopup,
    readTextFromClipboard,
    requestBiometricAuth,
    requestLocation,
    hapticFeedback,
    mainButton,
    backButton,
    settingsButton,
    cloudStorage,
    enableClosingConfirmation,
    disableClosingConfirmation,
    enableVerticalSwipes,
    disableVerticalSwipes,
    openInvoice,
    openLink,
    openTelegramLink,
  };
};
