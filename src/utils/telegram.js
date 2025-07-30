// src/utils/telegram.js - Yangilangan versiya
export const initTelegramWebApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    try {
      // WebApp ni tayyorlash
      tg.ready();
      tg.expand();

      // Tema sozlamalari
      tg.setHeaderColor("#4facfe");
      tg.setBackgroundColor("#f8f9fa");

      // Yopishni tasdiqlash
      tg.enableClosingConfirmation();

      console.log("✅ Telegram WebApp initialized successfully");
      return tg;
    } catch (error) {
      console.warn("⚠️ Telegram WebApp initialization failed:", error);
      return null;
    }
  }

  console.log("ℹ️ Telegram WebApp not available, using fallback mode");
  return null;
};

export const shareTradeLink = (link) => {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      const tg = window.Telegram.WebApp;
      const message = `🔐 Xavfsiz savdo uchun havola:\n${link}\n\nTrade Lock orqalu xavfsiz savdo-sotiq qiling!`;
      tg.switchInlineQuery(message);
      return true;
    } catch (error) {
      console.warn("Telegram share failed, using fallback:", error);
    }
  }

  // Fallback: Web Share API yoki clipboard
  if (navigator.share) {
    navigator
      .share({
        title: "Trade Lock - Xavfsiz Savdo",
        text: "Xavfsiz savdo uchun havola",
        url: link,
      })
      .catch(console.error);
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Havola nusxa olindi! Uni do'stingizga yuboring.");
      })
      .catch(() => {
        // Manual fallback
        const textArea = document.createElement("textarea");
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Havola nusxa olindi!");
      });
  } else {
    // Final fallback
    prompt("Ushbu havolani nusxa oling:", link);
  }
};

export const openExternalLink = (url) => {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      window.Telegram.WebApp.openLink(url);
      return;
    } catch (error) {
      console.warn("Telegram openLink failed, using fallback:", error);
    }
  }

  // Fallback
  window.open(url, "_blank", "noopener,noreferrer");
};

export const showAlert = (message) => {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      window.Telegram.WebApp.showAlert(message);
      return;
    } catch (error) {
      console.warn("Telegram showAlert failed, using fallback:", error);
    }
  }

  // Fallback
  alert(message);
};

export const showConfirm = (message, callback) => {
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      window.Telegram.WebApp.showConfirm(message, callback);
      return;
    } catch (error) {
      console.warn("Telegram showConfirm failed, using fallback:", error);
    }
  }

  // Fallback
  const result = confirm(message);
  if (callback) {
    callback(result);
  }
};

export const hapticFeedback = (type = "impact") => {
  if (
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.HapticFeedback
  ) {
    try {
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
      return;
    } catch (error) {
      console.warn("Telegram haptic feedback failed:", error);
    }
  }

  // Fallback: Console log for debugging
  console.log(`📳 Haptic feedback: ${type}`);

  // Web Vibration API (if available)
  if (navigator.vibrate) {
    const patterns = {
      success: [100],
      error: [100, 50, 100],
      warning: [150],
      light: [50],
      medium: [100],
      heavy: [200],
      selection: [25],
    };

    const pattern = patterns[type] || patterns.selection;
    navigator.vibrate(pattern);
  }
};
