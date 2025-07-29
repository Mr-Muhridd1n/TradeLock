// src/utils/telegram.js
export const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // WebApp ni tayyorlash
    tg.ready();
    tg.expand();

    // Tema sozlamalari
    tg.setHeaderColor("#4facfe");
    tg.setBackgroundColor("#f8f9fa");

    // Yopishni tasdiqlash
    tg.enableClosingConfirmation();

    return tg;
  }

  return null;
};

export const shareTradeLink = (link) => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    const message = `🔐 Xavfsiz savdo uchun havola:\n${link}\n\nTrade Lock orqali xavfsiz savdo-sotiq qiling!`;

    tg.switchInlineQuery(message);
  } else {
    // Fallback: clipboard ga copy qilish
    navigator.clipboard.writeText(link);
    alert("Havola nusxa olindi!");
  }
};

export const openExternalLink = (url) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, "_blank");
  }
};

export const showAlert = (message) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

export const showConfirm = (message, callback) => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
  } else {
    const result = confirm(message);
    callback(result);
  }
};

export const hapticFeedback = (type = "impact") => {
  if (
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.HapticFeedback
  ) {
    const hf = window.Telegram.WebApp.HapticFeedback;

    switch (type) {
      case "success":
        hf.notificationOccurred("success");
        break;
      case "error":
        hf.notificationOccurred("error");
        break;
      case "warning":
        hf.notificationOccurred("warning");
        break;
      case "light":
        hf.impactOccurred("light");
        break;
      case "medium":
        hf.impactOccurred("medium");
        break;
      case "heavy":
        hf.impactOccurred("heavy");
        break;
      default:
        hf.selectionChanged();
    }
  }
};
